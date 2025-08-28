// webdevtypescript\src\app\api\analytics\setup-indexes\route.ts
// Run this once to set up TTL indexes properly

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../../backend/lib/mongodb';

//Helper function to verify admin token
const verifyAdminToken = async (request: NextRequest) => {
  const token = request.cookies.get('token')?.value;
  if (!token || !process.env.JWT_SECRET) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    
    const client = await clientPromise;
    const users = client.db('Webdev').collection('info');
    const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
    
    if (user && user.role === 'admin' && user.isActive !== false) {
      return user;
    }
    return null;
  } catch {
    return null;
  }
};

export async function POST(req: NextRequest) {
  try {
    //Verify admin access
    const adminUser = await verifyAdminToken(req);
    if (!adminUser) {
      return NextResponse.json({ 
        message: 'Access denied. Admin privileges required.' 
      }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db('Webdev');
    const uniqueVisitors = db.collection('unique_visitors');

    const results = [];

    try {
      //Create TTL index - documents expire 1 hours after lastVisit
      await uniqueVisitors.createIndex(
        { "lastVisit": 1 }, 
        { 
          expireAfterSeconds: 3600, 
          name: "ttl_lastVisit_1h"
        }
      );
      results.push("✓ TTL index created - documents expire after 24 hours");
    } catch (error: any) {
      if (error?.message?.includes('already exists')) {
        results.push("✓ TTL index already exists");
      } else {
        results.push(`✗ TTL index error: ${error?.message || 'Unknown error'}`);
      }
    }

    try {
      //Create compound index for faster lookups
      await uniqueVisitors.createIndex(
        { "page": 1, "visitorKey": 1 }, 
        { 
          name: "page_visitor_compound",
          unique: true // Prevent duplicate visitor records for same page
        }
      );
      results.push("✓ Compound index created for page-visitor lookups");
    } catch (error: any) {
      if (error?.message?.includes('already exists')) {
        results.push("✓ Compound index already exists");
      } else {
        results.push(`✗ Compound index error: ${error?.message || 'Unknown error'}`);
      }
    }

    //Get current index information
    const indexes = await uniqueVisitors.indexes();
    
    return NextResponse.json({
      message: 'Index setup completed',
      results: results,
      currentIndexes: indexes.map(idx => ({
        name: idx.name,
        key: idx.key,
        expireAfterSeconds: idx.expireAfterSeconds || 'none'
      }))
    });

  } catch (error: any) {
    console.error('Error setting up indexes:', error);
    return NextResponse.json({ 
      message: 'Internal server error'
    }, { status: 500 });
  }
}

//GET endpoint to check current index status
export async function GET(req: NextRequest) {
  try {
    const adminUser = await verifyAdminToken(req);
    if (!adminUser) {
      return NextResponse.json({ 
        message: 'Access denied. Admin privileges required.' 
      }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db('Webdev');
    const uniqueVisitors = db.collection('unique_visitors');

    const indexes = await uniqueVisitors.indexes();
    
    //Get collection stats 
    const count = await uniqueVisitors.countDocuments();
    const sampleDocs = await uniqueVisitors.find({}).limit(3).toArray();

    return NextResponse.json({
      indexes: indexes.map(idx => ({
        name: idx.name,
        key: idx.key,
        expireAfterSeconds: idx.expireAfterSeconds || 'none',
        unique: idx.unique || false
      })),
      collectionStats: {
        count: count,
        size: 'N/A (deprecated method)',
        avgObjSize: 'N/A (deprecated method)'
      },
      sampleDocuments: sampleDocs.map(doc => ({
        page: doc.page,
        visitorType: doc.isRegistered ? 'registered' : 'anonymous',
        lastVisit: doc.lastVisit,
        timeUntilExpiry: doc.lastVisit ? 
        Math.max(0, 3600 - Math.floor((Date.now() - doc.lastVisit.getTime()) / 1000)) + ' seconds'
        : 'unknown'
      }))
    });

  } catch (error: any) {
    console.error('Error checking indexes:', error);
    return NextResponse.json({ 
      message: 'Internal server error'
    }, { status: 500 });
  }
}