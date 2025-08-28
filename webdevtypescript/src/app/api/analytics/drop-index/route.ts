// /api/analytics/drop-index/route.ts
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

export async function DELETE(req: NextRequest) {
  try {
    //Verify admin access
    const adminUser = await verifyAdminToken(req);
    if (!adminUser) {
      return NextResponse.json({ 
        message: 'Access denied. Admin privileges required.' 
      }, { status: 403 });
    }

    const { indexName } = await req.json();

    if (!indexName) {
      return NextResponse.json({ 
        message: 'Index name is required' 
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('Webdev');
    const uniqueVisitors = db.collection('unique_visitors');

    //Get current indexes before deletion
    const indexesBefore = await uniqueVisitors.indexes();
    
    try {
      //Drop the specified index
      await uniqueVisitors.dropIndex(indexName);
      
      //Get indexes after deletion to confirm
      const indexesAfter = await uniqueVisitors.indexes();
      
      return NextResponse.json({
        message: `Index '${indexName}' dropped successfully`,
        indexesBefore: indexesBefore.map(idx => ({
          name: idx.name,
          expireAfterSeconds: idx.expireAfterSeconds || 'none'
        })),
        indexesAfter: indexesAfter.map(idx => ({
          name: idx.name,
          expireAfterSeconds: idx.expireAfterSeconds || 'none'
        }))
      });

    } catch (error: any) {
      if (error.message?.includes('index not found')) {
        return NextResponse.json({ 
          message: `Index '${indexName}' not found`
        }, { status: 404 });
      }
      
      throw error;
    }

  } catch (error: any) {
    console.error('Error dropping index:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}

//GET endpoint to list all indexes
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
    
    return NextResponse.json({
      indexes: indexes.map(idx => ({
        name: idx.name,
        key: idx.key,
        expireAfterSeconds: idx.expireAfterSeconds || 'none',
        unique: idx.unique || false
      }))
    });

  } catch (error: any) {
    console.error('Error fetching indexes:', error);
    return NextResponse.json({ 
      message: 'Internal server error'
    }, { status: 500 });
  }
}