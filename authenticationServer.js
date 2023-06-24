/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const bodyParser = require("body-parser");

const PORT = 3000;
const app = express();
var users = [];
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
//get file contents

//using body parser middleware for reading json body
// app.use(bodyParser.json()); no need to use body parser
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Auth Server");
});
app.post("/signup", (req, res) => {
  let userData = req.body;
  console.log("user", userData);
  let userAlreadyExists =
    users.filter((user) => user.email === userData.email).length > 0
      ? true
      : false;
  if (userData && !userAlreadyExists) {
    const user = { id: uuidv4(), ...userData };
    users.push({ id: uuidv4(), ...userData });
  } else {
    res.status(400).json({ error: "User/Email Alredy Exists!" });
  }
  console.log("users", users);
  res.status(200).json({ msg: "User Added!" });
});
app.post("/login", (req, res) => {
  let { email, password } = req.body;
  console.log("email, pwd", email, password);
  let userInfo = users.filter(
    (user) => user.email === email && user.password === password
  )[0];
  if (userInfo) {
    res.status(200).json({ user: userInfo });
  } else {
    res.status(404).json({ msg: "Invalid Credentials" });
  }
});
app.get("/data", (req, res) => {
  res.status(200).json({ users: users });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
module.exports = app;
