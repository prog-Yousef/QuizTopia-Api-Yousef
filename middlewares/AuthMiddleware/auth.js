import middy from "@middy/core";
import { checkToken } from '../../utils/Jwt/jwt.js';
import { sendError } from "../../responses/responses.js";
import { db } from "../../services/db.js";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = () => {
    return {
      before: async (handler) => {
        const { headers } = handler.event;
        const authToken = headers.authorization || headers.Authorization ;
  
        if (!authToken) {
          return sendError(401, { error: 'Unauthorized without token' });
        }
  
        try {
          const token = authToken.replace("Bearer ", "").trim(); // eller split(' ')[1];
          const verifiedToken = checkToken(token);
  
          if (!verifiedToken || !verifiedToken.UserId) {
            return sendError(401, { error: 'Invalid token' });
          }
  
          const params = {
            TableName: process.env.USERS_TABLE,
            Key: {
              UserId: verifiedToken.UserId
            }
          };
          const user = await db.get(params);
  
          if (!user.Item) {
            return sendError(401, 'User not found');
          }
  
          handler.event.user = {
            UserId: verifiedToken.UserId,
            username: user.Item.username
          };
        } catch (error) {
          console.log(error, "token is not valid Unauthorized");
          return sendError(401, 'Invalid or expired token');
        }
      }
    };
  };
  
  export default authMiddleware;