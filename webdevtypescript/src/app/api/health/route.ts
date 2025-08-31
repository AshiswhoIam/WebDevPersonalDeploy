//webdevtypescript\src\app\api\health\route.ts
import { NextRequest, NextResponse } from 'next/server';

//GET endpoint to check health status from an external API
export async function GET(request: NextRequest) {
  try {
    //Prepare headers for the external API request
    const headers: Record<string, string> = {};
    if (process.env.HF_TOKEN) {
      //Add Hugging Face API token if available
      headers['Authorization'] = `Bearer ${process.env.HF_TOKEN}`;
    }
    //Make a GET request to the external HF_SPACE_URL/health endpoint
    const response = await fetch(`${process.env.HF_SPACE_URL}/health`, {
      method: 'GET',
      headers,
    });
    //If the response is not successful, return an error JSON
    if (!response.ok) {
      return NextResponse.json(
        { error: `Health check failed: ${response.statusText}` },
        { status: response.status }
      );
    }
    //Parse the JSON result from the external API
    const result = await response.json();
    //Return the health data as JSON
    return NextResponse.json(result);
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { error: 'Internal server error during health check' },
      { status: 500 }
    );
  }
}