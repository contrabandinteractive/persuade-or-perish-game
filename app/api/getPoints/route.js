export const maxDuration = 300;
import { NextResponse } from 'next/server'
import AWS from "aws-sdk";
import { headers } from 'next/headers'

// Configure AWS SDK
AWS.config.update({
  region: "us-east-2", // Replace with your region
  accessKeyId: process.env.MY_ACCESS_KEY_ID,
  secretAccessKey: process.env.MY_SECRET_ACCESS_KEY,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();


export async function GET(request) {
  try {

    const currentUrl = request.url; // Full URL of the request
    console.log('Current URL:', currentUrl);
  
    const urlObj = new URL(currentUrl);
    const searchParams = new URLSearchParams(urlObj.search);
  
    const chatId = searchParams.get('chatId');
    console.log('Chat ID:', chatId);

      const params = {
        TableName: "persuadeorperish",
        Key: {
          chatId, // Assumes 'chatId' is the primary key in your DynamoDB table
        },
      };

      try {
        const data = await dynamodb.get(params).promise();
        if (!data.Item) {
          return res.status(404).json({ message: "Chat ID not found" });
        }
    
        const points = data.Item.points; // Replace 'points' with the actual attribute name in your table
    
        return NextResponse.json({ points: points });
      } catch (error) {
        console.error("Error fetching data from DynamoDB:", error);
        return NextResponse.json({ error: error }, { status: 500 });
      }

      
  } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json({ error: 'Invalid JSON or request failed.' }, { status: 400 });
  }
}

