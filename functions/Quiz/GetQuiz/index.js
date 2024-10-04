import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { db } from '../../../services/db.js';
import { sendResponse, sendError } from '../../../responses/responses.js';
import middy from '@middy/core';

const getQuiz = async (event) => {
    const quizId = event.pathParameters.quizId;

    if (!quizId) {
        return sendError(400, 'No quizId provided');
    }

    try {
        const params = {
            TableName: process.env.QUIZ_TABLE,
            FilterExpression: 'quizId = :quizId',
            ExpressionAttributeValues: {
                ':quizId': quizId,
            },
        };

        const command = new ScanCommand(params);
        const data = await db.send(command);

        // Check if the quiz was found
        if (data.Items.length === 0) {
            return sendError(404, 'Quiz not found');
        }

        // Return the quiz data
        return sendResponse(200, data.Items[0]);
    } catch (error) {
        console.log('Error in getQuiz:', error);
        return sendError(500, 'Problem getting quiz from database');
    }
};

// Export the handler wrapped with Middy
export const handler = middy(getQuiz);
