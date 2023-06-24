/**
  You need to create an express HTTP server in Node.js which will handle the logic of a file server.
  - Use built in Node.js `fs` module

  The expected API endpoints are defined below,
  1. GET /files - Returns a list of files present in `./files/` directory
    Response: 200 OK with an array of file names in JSON format.
    Example: GET http://localhost:3000/files

  2. GET /file/:filename - Returns content of given file by name
     Description: Use the filename from the request path parameter to read the file from `./files/` directory
     Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     Example: GET http://localhost:3000/file/example.txt

    - For any other route not defined in the server return 404

    Testing the server - run `npm run test-fileServer` command in terminal
 */

const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

// Specify the folder path
const folderPath = __dirname + "/files/";

function readFolder(folderPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject("Invalid Path:", err);
      } else {
        resolve(files);
      }
    });
  });
}
function readFile(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, "utf8", (err, data) => {
      if (err) {
        reject("File not found", err);
      } else resolve(data);
    });
  });
}
app.get("/", (req, res) => {
  res.send("Welcome to the File Server App");
});

//get files
app.get("/files", (req, res) => {
  // Read the contents of the folder using promises
  readFolder(folderPath)
    .then((files) => {
      res.status(200).json(files);
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to retrieve files" });
    });
});

//read file content
app.get("/file/:filename", (req, res) => {
  const filepath = path.join(folderPath, req.params.filename);
  readFile(filepath)
    .then((content) => {
      res.status(200).json(content);
    })
    .catch((err) => res.status(404).json({ error: "File doesn't exists!" }));
});

//get file contents
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
