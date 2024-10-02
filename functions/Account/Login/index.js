import { db } from "../../../services/db.js";
import { sendResponse, sendError } from "../../../responses/responses.js";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { comparePassword } from "../../../utils/bcrypt.js";
import { createToken } from "../../../utils/Jwt/jwt.js";


const login = async (event) => {
    const { username, password } = event.body;
    if (!username || !password) {
        return sendError(400, 'Username and Password are required');
    }
    try {
        const params = {
            TableName: process.env.USERS_TABLE,
            IndexName: "Username-Index",
            KeyConditionExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username
            },

        };

const data = await db.query(params);
const user = data.Items[0];
if (!user) {
    return sendError(404, "User not found");
}
const validPassword = await comparePassword(password, user.password);
if (!validPassword) {
    return sendError(400, {error:"Invalid Password"});
}

const token = createToken(user.userId);
return sendResponse(200, { message: 'Login successful', token: token });

} catch (error) {
    console.log(error, 'Problem with login');
    return sendError(500, {error:'Problem with login'});
}
};
export const handler = middy(login).use(jsonBodyParser());