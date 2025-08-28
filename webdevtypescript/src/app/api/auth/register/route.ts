import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '../../../../../backend/lib/mongodb.js';

//Function for handling api route auth for register
export async function POST(req: NextRequest) {
  try {
    //Parse the request body to extract user input
    const { name, email, password, confirmPassword } = await req.json();

    //Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    //Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json({ message: 'Passwords do not match' }, { status: 400 });
    }

    //Enforce minimum password length **will update this later for better security.
    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    //Validate email format using a simple regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    //Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('Webdev');
    const users = db.collection('info');

    //Check if a user with the same email already exists
    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
    }

    //Hash the user's password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    //Create the new user object with role and status fields
    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      status: 'offline',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    //Insert the new user into the db
    const result = await users.insertOne(newUser);

    //If the insert succeeded, respond with success and user info excluding password
    if (result.insertedId) {
      return NextResponse.json({
        message: 'User created successfully',
        user: {
          id: result.insertedId,
          name,
          email: email.toLowerCase(),
          role: newUser.role,
          status: newUser.status,
          createdAt: newUser.createdAt
        }
      }, { status: 201 });
    } else {
      return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
    }

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}