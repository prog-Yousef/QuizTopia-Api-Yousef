import middy from "@middy/core";   
import jsonBodyParser from "@middy/http-json-body-parser";
import authMiddleware from "../../../middlewares/AuthMiddleware/auth.js";
import { v4 as uuidv4 } from 'uuid';
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "../../../services/db.js";
import { sendResponse, sendError } from "../../../responses/responses.js";
import dotenv from "dotenv";

dotenv.config();

export const addQuestion = async (event) => {

const { quizId } = event.pathParameters;
const { UserId } = event.user;
const questionInfo = event.body;


    const quizParams = {
        TableName: process.env.QUIZ_TABLE,
        Key: {
            quizId,
            UserId,
        },
    };

    try { 
        const questionData = await db.send(new GetCommand(quizParams));

        if (!questionData.Item) {
            return sendError(404, 'Quiz not found');
        }

const questionId = uuidv4();
const questionParams = {
    TableName: process.env.QUESTIONS_TABLE,
    Item: {
        questionId,
        quizId,
        UserId,
        questionInfo,
        createdAt: new Date().toISOString(),
    },
};

await db.send(new PutCommand(questionParams));
return sendResponse(201, {
    message: 'Question added successfully',
    questionId,
});

} catch (error) {
    console.error('Error adding question:', error);
    return sendError(500, 'Problem with adding question');
}
}

export const handler = middy(addQuestion)
  .use(jsonBodyParser())
  .use(authMiddleware());