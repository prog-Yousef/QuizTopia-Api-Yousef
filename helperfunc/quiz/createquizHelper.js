import {db } from "../../services/db.js";
import {v4 as uuidv4} from 'uuid';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import dotenv from "dotenv";
dotenv.config();

export const createQuiz = async (title, UserId, username) => {
  const quizId = uuidv4();
  const params = {
    TableName: process.env.QUIZ_TABLE,
    Item: {
      quizId,
      UserId,
      username,
      title,
      createdAt: new Date().toISOString(),
    },
  };
  console.log("DynamoDB params:", params); // Log the parameters


  try {
    const command = new PutCommand(params);
    await db.send(command); // Use the db instance to send the command
    return quizId;
  } catch (error) {
    console.error('Error in createQuiz:', error);
    throw new Error('Problem creating quiz in database');
  }
};