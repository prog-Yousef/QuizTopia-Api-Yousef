User Management
POST /auth/signup
Create a new user account.
URL: https://wzkx9xrdsh.execute-api.eu-north-1.amazonaws.com/dev/auth/signup
Request Body:

json
Kopiera kod
{
  "username": "string",
  "password": "string"
}
POST /auth/login
Authenticate a user.
URL: https://wzkx9xrdsh.execute-api.eu-north-1.amazonaws.com/dev/auth/login
Request Body:

json
Kopiera kod
{
  "username": "string",
  "password": "string"
}
Quiz Management
POST /quiz
Create a new quiz.
URL: https://3icvvxg7q8.execute-api.eu-north-1.amazonaws.com/quiz
Request Body:

json
Kopiera kod
{
  "title": "Planeter"
}
GET /quiz
Retrieve all quizzes.
URL: https://wzkx9xrdsh.execute-api.eu-north-1.amazonaws.com/dev/quiz

GET /quiz/{quizId}
Retrieve a quiz by quizId.
URL: https://wzkx9xrdsh.execute-api.eu-north-1.amazonaws.com/dev/quiz/{quizId}

DELETE /quiz/{quizId}
Delete a quiz by quizId.
URL: https://wzkx9xrdsh.execute-api.eu-north-1.amazonaws.com/dev/quiz/{quizId}

Question Management
POST /quiz/{quizId}/question
Add a question to a specific quiz.
URL: https://wzkx9xrdsh.execute-api.eu-north-1.amazonaws.com/dev/quiz/{quizId}/question
Request Body:

json
Kopiera kod
{
  "question": "Vad planeten närmast solen?",
  "answer": "merkurius"
}
GET /quiz/{quizId}/question
Get all questions for a specific quiz.
URL: https://wzkx9xrdsh.execute-api.eu-north-1.amazonaws.com/dev/quiz/{quizId}/question

Leaderboard and Gameplay
GET /leaderBoard/{quizId}
Get the leaderboard for a specific quiz.
URL: https://wzkx9xrdsh.execute-api.eu-north-1.amazonaws.com/dev/leaderBoard/{quizId}

POST /leaderBoard/{quizId}
Submit answers and add score to the leaderboard.
URL: https://wzkx9xrdsh.execute-api.eu-north-1.amazonaws.com/dev/leaderBoard/{quizId}

🔒 Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header.