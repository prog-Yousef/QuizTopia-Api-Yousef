import middy from "@middy/core";
import { DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "../../../services/db.js";
import { sendResponse, sendError } from "../../../responses/responses.js";
import  authMiddleware  from "../../../middlewares/AuthMiddleware/auth.js";
import dotenv from "dotenv";
dotenv.config();


const deleteQuiz = async (event) => {

    const {quizId} = event.pathParameters;
const {UserId} = event.user;

try {
    
    const params = {
        TableName: process.env.QUIZ_TABLE,
        Key: {
            quizId,
            UserId,
        },
    };

    const getCommand = new GetCommand(params);;
    const data = await db.send(getCommand);
    if (!data.Item) {
        return sendError(404, 'Quiz not found');
    }
if (data.Item.UserId !== UserId) {
    return sendError(401, 'Unauthorized to delete this quiz');
}   

const deleteParams = {
    TableName: process.env.QUIZ_TABLE,
    Key: {
        quizId,
        UserId,
    },
};

 const deleteCommand = new DeleteCommand(deleteParams);
await db.send(deleteCommand);

 return sendResponse(200, 'Quiz deleted successfully');

} catch (error) {
    console.log('Error in deleteQuiz:', error);
    return sendError(500, 'Problem deleting quiz from database');
}
    
};

export const handler = middy(deleteQuiz).use(authMiddleware());