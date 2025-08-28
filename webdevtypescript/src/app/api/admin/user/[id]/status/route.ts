//api/admin/user/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../../../../backend/lib/mongodb';

//Helper function to verify admin token
const verifyAdminToken = async (request: NextRequest) => {
  const token = request.cookies.get('token')?.value;
  if (!token || !process.env.JWT_SECRET) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    
    //Get user from database to check role
    const client = await clientPromise;
    const users = client.db('Webdev').collection('info');
    const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
    
    //Return user if they're admin and active
    if (user && user.role === 'admin' && user.isActive !== false) {
      return user;
    }
    return null;
  } catch {
    return null;
  }
};

//Retrieve all users for admin management
export async function GET(req: NextRequest) {
  try {
    //Verify admin access
    const adminUser = await verifyAdminToken(req);
    if (!adminUser) {
      return NextResponse.json({ 
        message: 'Access denied. Admin privileges required.' 
      }, { status: 403 });
    }

    //Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('Webdev');
    const users = db.collection('info');

    //Get all users
    const allUsers = await users.find(
      {}, 
      { 
        projection: { 
          password: 0 // Exclude password field
        }
      }
    ).sort({ createdAt: -1 }).toArray(); //Sort by newest first

    //Format users data to match the frontend interface  USING lastLogin only
    const formattedUsers = allUsers.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture || null,
      isActive: user.isActive !== false, // Default to true if not set
      lastLogin: user.lastLogin || null,
      createdAt: user.createdAt || null,
      role: user.role || 'user'
    }));

    return NextResponse.json({
      users: formattedUsers
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching users for admin:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}