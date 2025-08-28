import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../../backend/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    //If token exists, update user status to offline
    if (token && process.env.JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
        
        const client = await clientPromise;
        const db = client.db('Webdev');
        const users = db.collection('info');

        await users.updateOne(
          { _id: new ObjectId(decoded.userId) },
          { 
            $set: { 
              status: 'offline',
              updatedAt: new Date()
            }
          }
        );
      } catch (error) {
        console.log('Token verification failed during logout:', error);
        //Continue with logout even if token is invalid
      }
    }

    //Clear the cookie
    const response = NextResponse.json({
      message: 'Logged out successfully'
    }, { status: 200 });

    response.cookies.set('token', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}