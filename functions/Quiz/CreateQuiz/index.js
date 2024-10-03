/* import { db } from '../../../services/db.js'; */
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import authMiddleware from '../../../middlewares/AuthMiddleware/auth.js';
/* import { v4 as uuidv4 } from 'uuid';
import { PutCommand } from '@aws-sdk/lib-dynamodb' */;
import { sendResponse, sendError } from '../../../responses/responses.js';
import { createQuiz } from '../../../helperfunc/quiz/createquizHelper.js';
import dotenv from "dotenv";

dotenv.config();

const createQuizHandler = async (event) => {
  const { title } = event.body;
  const { UserId, username } = event.user;
  console.log("UserId:", UserId); // Log user info
  console.log("username:", username); 
  console.log("title:", title); 

  try {
    const quizId = await createQuiz(title, UserId, username);
    console.log("Quiz created with ID:", quizId); // Log quiz creation

    return sendResponse(201, { message: 'Quiz created successfully', quizId });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return sendError(500, { error: 'Problem with creating quiz' });
  }
};

// Export the handler wrapped in Middy with middleware
export const handler = middy(createQuizHandler)
  .use(jsonBodyParser())
  .use(authMiddleware());