import { db } from "../../../services/db.js"; // Ensure this is the correct import path for your db instance
import { sendResponse, sendError } from "../../../responses/responses.js"; // Ensure this is the correct import path
import middy from "@middy/core";
import authMiddleware from "../../../middlewares/AuthMiddleware/auth.js";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

// Handler function for getting questions by quiz ID
const getQuestion = async (event) => {
    const { quizId } = event.pathParameters; // Correct the variable name to quizId

    const params = {
        TableName: process.env.QUESTIONS_TABLE,
        IndexName: "QuizIdIndex",
        KeyConditionExpression: "#quizId = :quizId",
        ExpressionAttributeNames: {
            "#quizId": "quizId", // Define the attribute name
        },
        ExpressionAttributeValues: {
            ":quizId": quizId, // Use the quizId variable from path parameters
        },
    };

    try {
        const data = await db.send(new QueryCommand(params)); // Use QueryCommand to send the request
        const questions = data.Items || []; // Ensure questions is an array

        if (questions.length === 0) {
            return sendError(404, "Question not found");
        }

        return sendResponse(200, questions);
    } catch (error) {
        console.error("Error in getQuestion:", error);
        return sendError(500, { error: "Could not retrieve questions" });
    }
};

// Exporting the handler wrapped in middy for middleware support
export const handler = middy(getQuestion).use(authMiddleware());
