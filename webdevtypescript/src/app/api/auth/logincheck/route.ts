import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../../backend/lib/mongodb.js'; 

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    //Check if JWT_SECRET exists
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set!');
      return NextResponse.json({ 
        message: 'Server configuration error' 
      }, { status: 500 });
    }

    //Verify the token 
    const decoded = jwt.verify(token, jwtSecret) as any;

    //Get user from database to include profilePicture and role
    const client = await clientPromise;
    const db = client.db('Webdev');
    const users = db.collection('info');

    const user = await users.findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } } // Exclude password
    );

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        status: user.status || 'offline',
        profilePicture: user.profilePicture || null
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}