import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../../backend/lib/mongodb.js';

//Helper function to verify admin token
const verifyAdminToken = async (request: NextRequest) => {
  const token = request.cookies.get('token')?.value;
  if (!token || !process.env.JWT_SECRET) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    
    // Get user from database to check role
    const client = await clientPromise;
    const users = client.db('Webdev').collection('info');
    const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
    
    // Return user if they're admin
    if (user && user.role === 'admin') {
      return user;
    }
    return null;
  } catch {
    return null;
  }
};

//Helper function to clean up inactive users
const cleanupInactiveUsers = async () => {
  try {
    const client = await clientPromise;
    const users = client.db('Webdev').collection('info');
    
    //Calculate 1 minute ago
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    
    //Mark non-admin users as offline if their lastLogin is over 1 min old
    const result = await users.updateMany(
      { 
        status: 'online',
        role: { $ne: 'admin' }, // Exclude admins
        lastLogin: { $lt: oneMinuteAgo }
      },
      { 
        $set: { 
          status: 'offline',
          updatedAt: new Date()
        }
      }
    );

    console.log(`Auto-cleanup: Marked ${result.modifiedCount} users as offline`);
    return result.modifiedCount;
  } catch (error) {
    console.error('Cleanup error:', error);
    return 0;
  }
};

//Retrieve all users for admin management
export async function GET(req: NextRequest) {
  try {
    // Verify admin access
    const adminUser = await verifyAdminToken(req);
    if (!adminUser) {
      return NextResponse.json({ 
        message: 'Access denied. Admin privileges required.' 
      }, { status: 403 });
    }

    //Run cleanup before fetching users
    const cleanedUpCount = await cleanupInactiveUsers();

    //Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('Webdev');
    const users = db.collection('info');

    //Get all users (after cleanup)
    const allUsers = await users.find(
      {}, 
      { 
        projection: { 
          password: 0 // Exclude password field
        }
      }
    ).sort({ createdAt: -1 }).toArray(); // Sort by newest first

    //Format users data to match the frontend interface
    const formattedUsers = allUsers.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture || null,
      status: user.status || 'offline',
      lastLogin: user.lastLogin || null,
      createdAt: user.createdAt || null,
      role: user.role || 'user'
    }));

    return NextResponse.json({
      users: formattedUsers,
      cleanupInfo: {
        usersMarkedOffline: cleanedUpCount,
        cleanupTime: new Date().toISOString()
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching users for admin:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}