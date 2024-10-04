import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();



export const createToken = (UserId) => {
  const payload = {
    UserId,

  };

  const options = {
    expiresIn: '1h',
  };

  return jwt.sign(payload, process.env.JWT_KEY, options);
};

// Named export for CheckToken function
export const checkToken = (token) => {
    try {
      const parsedToken = jwt.verify(token, process.env.JWT_KEY);
      return parsedToken;
    } catch (error) {
      console.error('Invalid token:', error);
      throw new Error('Invalid token');
    }
  };