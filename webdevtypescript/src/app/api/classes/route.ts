//webdevtypescript\src\app\api\classes\route.ts
import { NextRequest, NextResponse } from 'next/server';

//GET endpoint to fetch available "classes" from an external API
export async function GET(request: NextRequest) {
  try {
    const headers: Record<string, string> = {};

    //Use Hugging Face API token if available
    if (process.env.HF_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.HF_TOKEN}`;
    }
    //Make a GET request to the external HF_SPACE_URL/classes endpoint
    const response = await fetch(`${process.env.HF_SPACE_URL}/classes`, {
      method: 'GET',
      headers,
    });
     //If the response is not successful, return an error JSON
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to get classes: ${response.statusText}` },
        { status: response.status }
      );
    }
     //Parse the JSON result from the external API
    const result = await response.json();
    //Return the classes data as JSON
    return NextResponse.json(result);
  } catch (error) {
    console.error('Get classes error:', error);
    return NextResponse.json(
      { error: 'Internal server error while getting classes' },
      { status: 500 }
    );
  }
}