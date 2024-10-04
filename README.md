🎉 Quiztopia API
Quiztopia is a fun and interactive quiz application that offers various endpoints for user management, quiz management, question management, and leaderboard functionalities.
## 📚Endpoints 


User Management
  POST -`https://wzkx9xrdsh.execute-api.eu-north-1.amazonaws.com/dev/auth/signup` : Create a new user account

{
  "username": "string",
  "password": "string"
}
POST - https://wzkx9xrdsh.execute-api.eu-north-1.amazonaws.com/dev/auth/login: Authenticate a user

  ```json
{
  "username": "string",
  "password": "string"
}
 ```
Quiz Management
 POST - `https://3icvvxg7q8.execute-api.eu-north-1.amazonaws.com/quiz`: Create a new quiz
  ```json
{
  "title": "Planeter"
}
 ```
GET - `https://wzkx9xrdsh.execute-api.eu-north-1.amazonaws.com/dev/quiz`: Retrieve all quizzes

 GET - `https://wzkx9xrdsh.execute-api.eu-north-1.amazonaws.com/dev/quiz/{quizId}`: Retrive by quizId

DELETE -`https://wzkx9xrdsh.execute-api.eu-north-1.amazonaws.com/dev/quiz/{quizId}` : Delete by quizID

### Question Management
  POST - https://wzkx9xrdsh.execute-api.eu-north-1.amazonaws.com/dev/quiz/{quizId}/question: Add a question to a specific quiz
  ```json
{
  "question": "Vad planeten närmast solen?",
  "answer": "merkurius",

}
  ```
  GET -`https://wzkx9xrdsh.execute-api.eu-north-1.amazonaws.com/dev/quiz/{quizId}/question` : Get all questions for a specific quiz

Leaderboard and Gameplay
GET - `https://wzkx9xrdsh.execute-api.eu-north-1.amazonaws.com/dev/leaderBoard/{quizId}`: Get the leaderboard for a specific quiz

POST -`https://wzkx9xrdsh.execute-api.eu-north-1.amazonaws.com/dev/leaderBoard/{quizId}`  Submit answers and add score to leaderboard

## Authentication
Create an account using the /signup endpoint
Log in using the /login endpoint to receive a JWT token
Include the JWT token in the Authorization header for all protected endpoints