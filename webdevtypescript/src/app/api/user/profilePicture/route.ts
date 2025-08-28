import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../../backend/lib/mongodb.js';

//Shared helpers
const verifyToken = (request: NextRequest): string | null => {
  const token = request.cookies.get('token')?.value;
  if (!token || !process.env.JWT_SECRET) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
};

const errorResponse = (message: string, status: number) => 
  NextResponse.json({ message }, { status });

const getUserById = async (userId: string) => {
  const client = await clientPromise;
  const users = client.db('Webdev').collection('info');
  return await users.findOne({ _id: new ObjectId(userId) });
};

const updateUser = async (userId: string, update: any) => {
  const client = await clientPromise;
  const users = client.db('Webdev').collection('info');
  return await users.updateOne({ _id: new ObjectId(userId) }, update);
};

const serializeUser = (user: any) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  profilePicture: user.profilePicture || null,
  role: user.role || 'user'
});

//Convert file to base64 with data URL format
const fileToBase64 = async (file: File): Promise<string> => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString('base64');
  return `data:${file.type};base64,${base64}`;
};

//Validate image size (base64 will be ~33% larger than original)
const validateImageSize = (file: File): boolean => {
  //MongoDB document size limit is 16MB
  //Base64 encoding increases size by ~33%, so 3MB file becomes ~4MB base64
  const maxSize = 3 * 1024 * 1024; // 3MB
  return file.size <= maxSize;
};

//POST - Handle profile picture upload
export async function POST(request: NextRequest) {
  try {
    const userId = verifyToken(request);
    if (!userId) return errorResponse('Unauthorized', 401);

    const formData = await request.formData();
    const file = formData.get('profilePicture') as File;
    if (!file) return errorResponse('No file provided', 400);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return errorResponse('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.', 400);
    }

    //Validate file size (more restrictive for base64 storage)
    if (!validateImageSize(file)) {
      return errorResponse('File size too large. Maximum size is 3MB for database storage.', 400);
    }

    //Get current user
    const currentUser = await getUserById(userId);
    if (!currentUser) return errorResponse('User not found', 404);

    //Convert file to base64
    const base64Image = await fileToBase64(file);

    // Update user with base64 image
    await updateUser(userId, {
      $set: { 
        profilePicture: base64Image,
        updatedAt: new Date() 
      }
    });

    return NextResponse.json({
      message: 'Profile picture updated successfully',
      profilePictureUrl: base64Image
    });

  } catch (error) {
    console.error('Profile picture upload error:', error);
    return errorResponse('Internal server error', 500);
  }
}

//DELETE - Handle profile picture removal
export async function DELETE(request: NextRequest) {
  try {
    const userId = verifyToken(request);
    if (!userId) return errorResponse('Unauthorized', 401);

    const currentUser = await getUserById(userId);
    if (!currentUser) return errorResponse('User not found', 404);
    if (!currentUser.profilePicture) return errorResponse('No profile picture to remove', 400);

    //Remove profile picture from database
    await updateUser(userId, {
      $unset: { profilePicture: 1 },
      $set: { updatedAt: new Date() }
    });

    return NextResponse.json({
      message: 'Profile picture removed successfully'
    });

  } catch (error) {
    console.error('Profile picture removal error:', error);
    return errorResponse('Internal server error', 500);
  }
}

//GET - Retrieve user profile
export async function GET(request: NextRequest) {
  try {
    const userId = verifyToken(request);
    if (!userId) return errorResponse('Unauthorized', 401);

    const user = await getUserById(userId);
    if (!user) return errorResponse('User not found', 404);

    return NextResponse.json({
      user: serializeUser(user)
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return errorResponse('Internal server error', 500);
  }
}