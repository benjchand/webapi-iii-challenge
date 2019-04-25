const express = require("express");
const postsRouter = require("./expressRouter/postsRouter.js");
const usersRouter = require("./expressRouter/usersRouter.js");

const server = express();
server.use(express.json());

server.get("/", (req, res) => {
  res.send(
    " <h2> Welcome to the Lambda API </h2> <h4> Use /api/users/, /api/users/id/, /api/users/posts/id/, and /api/posts/ to access API"
  );
});

server.use("/api/", postsRouter, upperCaseName(), usersRouter);

function upperCaseName() {
  return function(req, res, next) {
    // console.log(req.body.name.length);
    // console.log(req.body.name);

    // if (req.body.name !== undefined || req.body.name.length !== 0) {
    //   const name = req.body.name;
    //   if (name.charAt(0) !== name.charAt(0).toUpperCase()) {
    //     res.json("Make sure your name is a Proper Noun");
    //   }
    // }
    next();
  };
}

module.exports = server;
