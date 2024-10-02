import { db } from '../../../services/db.js';
import { sendResponse, sendError } from '../../../responses/responses.js';
import { v4 as uuidv4 } from 'uuid';
import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import { hashPassword } from '../../../utils/bcrypt.js'; 
import { PutCommand } from '@aws-sdk/lib-dynamodb';

const signup = async (event) => {
    const { username, password } = event.body;

    if (!username || !password) {
        return sendError(400, 'Username and Password are required');
    }
    
    try {
        const hashedPassword = await hashPassword(password);
        const UserId = uuidv4();

        const params = {
            TableName: process.env.USERS_TABLE,
            Item: {
                UserId: UserId,
                username: username,
                password: hashedPassword,
            },
        };

    // Use PutCommand instead of db.put()
    await db.send(new PutCommand(params));
    return sendResponse(200, { message: 'Account created successfully' });

    } catch (error) {
        console.error('Error creating account:', error);
        return sendError(500, { error: 'Problem with creating account' });
    }
};

export const handler = middy(signup).use(jsonBodyParser());
