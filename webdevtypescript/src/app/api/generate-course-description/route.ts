import { NextRequest } from 'next/server';

//This is the POST handler for incoming HTTP requests.
//It takes a request, extracts the course name from the body,and uses an external API to generate a description of the course.
export async function POST(req: NextRequest) {
  try {
    //Read and parse the incoming request body as JSON
    const body = await req.json();
    const { courseName } = body;

    //If there's no course name provided, return 400
    if (!courseName) {
      return new Response(JSON.stringify({ error: 'Course name is required' }), { status: 400 });
    }

    //Makes a POST request to Google's Gemini API with a prompt asking for a course description
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Provide a brief 2-3 sentence description of the university course: ${courseName}. Focus on what concepts students learn and practical applications.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7, //Controls randomness of response (higher = more creative)
            maxOutputTokens: 150, //Limits the response length
          }
        }),
      }
    );

    //If the external API request fails, throw an error and skip to catch block
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    //Parse the response JSON and extract the generated course description
    const data = await response.json();
    const description = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    //If no description was generated then err
    if (!description) {
      throw new Error('No description generated');
    }

    //Successfully return the generated course description
    return new Response(JSON.stringify({ description }), { status: 200 });
  } catch (error) {
    //Log any errors to the server console and return a 500 Internal Server Error
    console.error('Error generating course description:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate course description server error' }), { status: 500 });
  }
}
