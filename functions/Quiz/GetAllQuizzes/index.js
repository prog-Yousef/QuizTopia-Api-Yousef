import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../../../services/db.js';
import { sendResponse, sendError } from '../../../responses/responses.js';
import middy from '@middy/core';

const getAllQuiz = async () => {
    const params = {
        TableName: process.env.QUIZ_TABLE,
    };

    try {
        const command = new ScanCommand(params);
        const data = await db.send(command);

        // Use map to create the new array directly
        const allQuizzes = data.Items.map((item) => ({
            quizId: item.quizId,
            title: item.title,
            username: item.username,
            createdAt: item.createdAt,
        })).filter((quiz) => quiz.title && quiz.username); // Filter out any quizzes without title or username

        if (allQuizzes.length === 0) {
            return sendError(404, 'No quizzes found.');
        }

        return sendResponse(200, allQuizzes);
    } catch (error) {
        console.error('Error in getAllQuiz:', error);
        return sendError(500, 'Problem getting quizzes from the database.');
    }
};

// Export the handler wrapped in Middy if needed
export const handler = middy(getAllQuiz);
