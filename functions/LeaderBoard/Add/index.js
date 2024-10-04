import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import authMiddleware from "../../../middlewares/AuthMiddleware/auth.js";
import { sendResponse, sendError } from "../../../responses/responses.js";
import { db } from "../../../services/db.js";
import dotenv from "dotenv";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
dotenv.config();

const addLeaderBoard = async (event) => {
    const { answers } = event.body;
    const { quizId } = event.pathParameters;
    const { UserId, username } = event.user;
  
    if (!answers || !Array.isArray(answers)) {
      return sendError(400, {
        error: "Answers must be provided as an array of objects",
      });
    }
  
    try {
      // Fetch questions for the quiz
      const questionsParams = {
        TableName: process.env.QUESTIONS_TABLE,
        IndexName: "QuizIdIndex",
        KeyConditionExpression: "quizId = :quizId",
        ExpressionAttributeValues: {
          ":quizId": quizId,
        },
      };
  
      const questionData = await db.send(new QueryCommand(questionsParams));
      const questions = questionData.Items || [];
  
      if (questions.length === 0) {
        return sendError(404, {
          error: "No questions found for the given quizId.",
        });
      }
  
      // Ensure the number of answers matches the number of questions
      if (answers.length !== questions.length) {
        return sendError(400, {
          error: `Number of answers (${answers.length}) does not match the number of questions (${questions.length}).`,
        });
      }
  
      // Calculate score
      let score = 0;
      questions.forEach((question, index) => {
        const correctAnswer = question.questionInfo.correctAnswer.toLowerCase().trim();
        const userAnswer = answers[index].answer.toLowerCase().trim();
  
        if (userAnswer === correctAnswer) {
          score += 1; // Increment score for correct answer
        }
      });
  
      // Prepare leaderboard entry
      const leaderboardParams = {
        TableName: process.env.LEADERBOARD_TABLE,
        Item: {
          quizId,
          UserId,
          username,
          score,
          createdAt: new Date().toISOString(),
        },
      };
  
      await db.send(new PutCommand(leaderboardParams));
  
      return sendResponse(200, {
        message: "Quiz completed",
        score,
        totalQuestions: questions.length,
      });
  
    } catch (error) {
      console.error("Error in addLeaderBoard handler:", error);
      return sendError(500, { error: "Could not complete the quiz" });
    }
  };
  

export const handler = middy(addLeaderBoard)
  .use(jsonBodyParser())
  .use(authMiddleware());
