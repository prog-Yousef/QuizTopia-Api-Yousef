import middy from "@middy/core";
import CheckToken from "../../utils/Jwt/jwt.js";
import { sendError } from "../../responses/responses.js";
import { db } from "../../services/db.js";
import { signup } from "../../functions/Account/Signup/index.js";

// Middleware function to check authorization
const authMiddleware = () => ({
    before: async (request) => {
        const authToken = request.event.headers.authorization || request.event.headers.Authorization; 
        
        if (!authToken) {
            throw new Error('Unauthorized');
        }

        try {
            const token = authToken.split(' ')[1];  // Extract the token from the "Bearer" format
            const parsedToken = CheckToken(token);  // Validate and decode the token

            // Query DynamoDB for the user
            const params = {
                TableName: process.env.USERS_TABLE,
                Key: {
                    "userId": parsedToken.userId
                }
            };
            const data = await db.get(params);

            if (!data.Item) {
                throw new Error('User not found');
            }

            // Attach the user info to the request for further use
            request.event.userId = {
                userId: parsedToken.userId,
                username: data.Item.username
            };

        } catch (error) {
            console.log(error, 'Unauthorized');
            throw new Error('Unauthorized');
        }
    }
});

// Wrapping the handler with Middy and applying the authorization middleware
export const handler = middy(signup).use(authMiddleware());
