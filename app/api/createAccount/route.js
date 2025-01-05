export const maxDuration = 300;
import { NextResponse } from 'next/server'
import AWS from "aws-sdk";

// Configure AWS SDK
AWS.config.update({
    region: "us-east-2", // Replace with your region
    accessKeyId: process.env.MY_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_SECRET_ACCESS_KEY,
  });
  
const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function POST(request) {
  try {
      let body = await request.json();

      const chatId = body.chatId;

      const params = {
        TableName: 'persuadeorperish', 
        Item: {
          chatId: chatId, // Partition Key
          points: 0,      // Initial value for points
        },
      };

      try {
        await dynamodb.put(params).promise();
        return NextResponse.json({ success: 'success' });
      } catch (error) {
        console.error("Error fetching data from DynamoDB:", error);
        return NextResponse.json({ error: error }, { status: 500 });
      }
  } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json({ error: 'Invalid JSON or request failed.' }, { status: 400 });
  }
}

