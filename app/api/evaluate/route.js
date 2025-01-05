export const maxDuration = 300;
import { NextResponse } from 'next/server';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// Initialize the client outside the handler for reuse across requests
const client = new BedrockRuntimeClient({ 
  region: process.env.MY_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.MY_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_SECRET_ACCESS_KEY
  }
});

// Separate the model configuration
const MODEL_CONFIG = {
  modelId: process.env.MY_MODEL_ID,
  contentType: "application/json",
  accept: "application/json",
};

export async function POST(request) {
  try {
    // Input validation
    if (!request.body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { theText } = body;

    if (!theText || typeof theText !== 'string') {
      return NextResponse.json(
        { error: "Missing or invalid 'theText' in request body" },
        { status: 400 }
      );
    }

    // Create the parameters for the model
    const params = {
      ...MODEL_CONFIG,
      body: JSON.stringify({
        inferenceConfig: {
          max_new_tokens: 200,
          temperature: 0.7, // Added temperature for better control
          top_p: 0.9, // Added top_p for better response quality
        },
        messages: [
          {
            role: "user",
            content: [
              {
                text: `You are deciding the fate of humanity. Rate the following argument on a scale of 1 to 25 based on its logical strength.
Argument: "${theText}". Only return an integer from 1 to 25 in your response.`
              }
            ]
          }
        ]
      })
    };

    // Execute the model command
    const command = new InvokeModelCommand(params);
    const response = await client.send(command);
    
    if (!response.body) {
      throw new Error('Empty response from model');
    }

    const rawResult = new TextDecoder().decode(response.body);

    const result = JSON.parse(rawResult);
    
    // Check for different possible response formats
    const outputText = result.output.message.content[0].text;

    if (!outputText) {
      throw new Error('Could not find output text in response');
    }

    return NextResponse.json({ 
      report: outputText,
      status: 'success'
    });

  } catch (error) {
    console.error('Error processing request:', error);
    
    // Return appropriate error response based on error type
    return NextResponse.json({ 
      error: error.message || 'An unexpected error occurred',
      status: 'error'
    }, { 
      status: error.status || 500 
    });
  }
}
