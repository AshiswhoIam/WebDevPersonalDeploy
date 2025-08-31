//webdevtypescript\src\app\api\predict\route.ts
import { NextRequest, NextResponse } from 'next/server';

//POST endpoint to handle file uploads and get predictions from Hugging Face Space
export async function POST(request: NextRequest) {
  try {
    //Parse incoming form data and extract the uploaded file
    const formData = await request.formData();
    const file = formData.get('file') as File;
    //Return 400 if no file is provided
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    //Forward the request to Hugging Face Space
    const hfFormData = new FormData();
    hfFormData.append('file', file);
    //Prepare authorization header if HF_TOKEN is set
    const headers: Record<string, string> = {};
    if (process.env.HF_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.HF_TOKEN}`;
    }
    //Forward the file to Hugging Face predict endpoint
    const response = await fetch(`${process.env.HF_SPACE_URL}/predict`, {
      method: 'POST',
      body: hfFormData,
      headers,
    });
    //Handle errors from Hugging Face API
    if (!response.ok) {
      const errorText = await response.text();
      console.error('HF API Error:', errorText);
      return NextResponse.json(
        { error: `Prediction failed: ${response.statusText}` },
        { status: response.status }
      );
    }
    //Parse and return prediction results
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { error: 'Internal server error during prediction' },
      { status: 500 }
    );
  }
}
