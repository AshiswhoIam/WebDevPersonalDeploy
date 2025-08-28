import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from '../../../../../backend/lib/mongodb';

//Function for handling api route for login auth
export async function POST(req: NextRequest) {
  console.log('=== LOGIN ROUTE CALLED ===');
  
  try {
    //Extract email and password from the request body
    const { email, password } = await req.json();
    console.log('Login attempt for email:', email);

    //Validate input make sure email and password are provided
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    //Check if JWT_SECRET exists
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set!');
      return NextResponse.json({ 
        message: 'Server configuration error' 
      }, { status: 500 });
    }

    //Connect to MongoDB using client promise
    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    const db = client.db('Webdev');
    const users = db.collection('info');

    //Find user in the db by email
    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('User not found');
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    console.log('User found, verifying password...');
    //Check if password matches using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    console.log('Password valid, generating token...');
    //Generate JWT token for auth
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role || 'user'
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    //Update last login and set status to online
    await users.updateOne(
      { _id: user._id },
      { 
        $set: { 
          lastLogin: new Date(),
          status: 'online',
          updatedAt: new Date()
        }
      }
    );

    //Create response with user data
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        status: 'online'
      },
      token // Also return token for client-side storage if needed
    }, { status: 200 });

    //Set HTTP-only cookie for security
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    console.log('Login successful!');
    return response;

  } catch (error) {
    console.error('Login error:', error);

    const err = error as Error;
    return NextResponse.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    }, { status: 500 });
  }
}

//GET method for testing
export async function GET() {
  return NextResponse.json({
    message: 'Login endpoint - POST method required'
  }, { status: 405 });
}