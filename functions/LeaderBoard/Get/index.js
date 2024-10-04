import { db } from '../../../services/db.js';
import { sendResponse, sendError } from '../../../responses/responses.js';
import middy from '@middy/core';
import { QueryCommand } from '@aws-sdk/lib-dynamodb'; // Use @aws-sdk/lib-dynamodb for QueryCommand

// Function to get leaderboard from DynamoDB
export const getLeaderboard = async (quizId) => {
    const GetLeaderboardParams = {
        TableName: process.env.LEADERBOARD_TABLE,
        IndexName: "QuizScoreIndex",
        KeyConditionExpression: "quizId = :quizId",
        ExpressionAttributeValues: {
            ":quizId": quizId
        },
        ProjectionExpression: "score, username",
        ScanIndexForward: false,
    };

    try {
        const data = await db.send(new QueryCommand(GetLeaderboardParams));
        return data.Items.map((item) => ({ score: item.score, username: item.username }));
    } catch (error) {
        console.log('Error in getLeaderboard:', error);
        throw new Error('Problem getting leaderboard from database');
    }
};

// Handler function
const getLeaderboardHandler = async (event) => {
    const { quizId } = event.pathParameters;

    try {
        const leaderboard = await getLeaderboard(quizId);
        return sendResponse(200, leaderboard);
    } catch (error) {
        console.error("Error in getLeaderboardHandler:", error);
        return sendError(500, { error: "Could not retrieve leaderboard" });
    }
};

// Exporting the handler wrapped in middy for middleware support
export const handler = middy(getLeaderboardHandler);
