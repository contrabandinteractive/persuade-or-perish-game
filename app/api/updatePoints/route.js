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
      const body = await request.json();
      const { chatId, pointsChange } = body;
      
 
      console.log('Received chatId:::', chatId);
      // Parameters for updating points
      const params = {
        TableName: 'persuadeorperish',
        Key: { chatId }, // Ensure 'chatId' is the Partition Key
        UpdateExpression: 'SET points = if_not_exists(points, :start) + :change',
        ExpressionAttributeValues: {
          ':start': 0, // Default points if item doesn't exist
          ':change': pointsChange, // Add or subtract points
        },
        ReturnValues: 'UPDATED_NEW',
      };
  
      try {
        const result = await dynamodb.update(params).promise();
        return NextResponse.json({
          success: true,
          updatedPoints: result.Attributes.points, // Updated points value
        });
      } catch (error) {
        console.error('Error updating points in DynamoDB:', error);
        return NextResponse.json({ error: 'Error updating points in DynamoDB' }, { status: 500 });
      }
    } catch (error) {
      console.error('Error processing request:', error);
      return NextResponse.json({ error: 'Invalid JSON or request failed' }, { status: 400 });
    }
  }

