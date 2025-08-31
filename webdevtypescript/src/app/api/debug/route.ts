//webdevtypescript\src\app\api\debug\route.ts
import { NextRequest, NextResponse } from 'next/server';

//GET endpoint to fetch debug information from an external API
export async function GET(request: NextRequest) {
  try {
    const headers: Record<string, string> = {};
     //Add Hugging Face API token if available
    if (process.env.HF_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.HF_TOKEN}`;
    }
    //Make a GET request to the external HF_SPACE_URL/debug endpoint
    const response = await fetch(`${process.env.HF_SPACE_URL}/debug`, {
      method: 'GET',
      headers,
    });
    //If the response is not successful, return an error JSON
    if (!response.ok) {
      return NextResponse.json(
        { error: `Debug failed: ${response.statusText}` },
        { status: response.status }
      );
    }
    //Parse the JSON result from the external API
    const result = await response.json();
    //Return the debug data as JSON
    return NextResponse.json(result);
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: 'Internal server error during debug' },
      { status: 500 }
    );
  }
}