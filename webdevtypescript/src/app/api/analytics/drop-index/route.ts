// /api/analytics/drop-index/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../../backend/lib/mongodb';

//Helper function to verify admin token similar to mongodb js
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

//API route to delete a MongoDB index from the 'unique_visitors' collection
export async function DELETE(req: NextRequest) {
  try {
    //Verify admin access
    const adminUser = await verifyAdminToken(req);
    if (!adminUser) {
      return NextResponse.json({ 
        message: 'Access denied. Admin privileges required.' 
      }, { status: 403 });
    }
    //Extract indexName from request body
    const { indexName } = await req.json();
    //Return error if indexName is missing
    if (!indexName) {
      return NextResponse.json({ 
        message: 'Index name is required' 
      }, { status: 400 });
    }
    //Connect to MongoDB and select collection
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
      
      //Return success response with before/after index info
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
      //Handle case where index does not exist
      if (error.message?.includes('index not found')) {
        return NextResponse.json({ 
          message: `Index '${indexName}' not found`
        }, { status: 404 });
      }
      
      throw error;
    }

  } catch (error: any) {
    //Log and return internal server error
    console.error('Error dropping index:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}

//GET endpoint to list all indexes in 'unique_visitors' collection
export async function GET(req: NextRequest) {
  try {
    //Verify admin access
    const adminUser = await verifyAdminToken(req);
    if (!adminUser) {
      return NextResponse.json({ 
        message: 'Access denied. Admin privileges required.' 
      }, { status: 403 });
    }
    //Connect to MongoDB and select collection
    const client = await clientPromise;
    const db = client.db('Webdev');
    const uniqueVisitors = db.collection('unique_visitors');

    //Fetch all indexes from the collection
    const indexes = await uniqueVisitors.indexes();
    
    //Return formatted index information
    return NextResponse.json({
      indexes: indexes.map(idx => ({
        name: idx.name,
        key: idx.key,
        expireAfterSeconds: idx.expireAfterSeconds || 'none',
        unique: idx.unique || false
      }))
    });

  } catch (error: any) {
    //Log errors and return internal server error response
    console.error('Error fetching indexes:', error);
    return NextResponse.json({ 
      message: 'Internal server error'
    }, { status: 500 });
  }
}