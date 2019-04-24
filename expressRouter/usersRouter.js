const express = require("express");

const dbUsers = require("../data/helpers/userDb");
const router = express.Router();

const sendUserError = (status, message, res) => {
  res.status(status).json({ errorMessage: message });
  return;
};

// function upperCaseName() {
//   const { name } = req.body;
//   req.body = { name: "This is pigeon Pie" };
//   return req.body
// }

router.post("/users/", (req, res) => {
  const { name } = req.body;
  if (!name) {
    sendUserError(400, "Please provide a name for the user", res);
    return;
  }

  dbUsers
    .insert({
      name
    })
    .then(response => {
      res.status(201).json(response);
    })
    .catch(error => {
      console.log(error);
      sendUserError(
        500,
        `{ error: "There was an error while saving the user to the database" }`,
        res
      );
      return;
    });
});

router.get("/users/", (req, res) => {
  dbUsers
    .get()
    .then(users => {
      res.json({ users });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The users information could not be retrieved."
      });
    });
});

router.get("/users/:id", (req, res) => {
  const { id } = req.params;
  dbUsers
    .getById(id)
    .then(user => {
      if (user.length === 0) {
        sendUserError(
          404,
          '{ message: "The user with the specified ID does not exist." }',
          res
        );
        return;
      }
      res.json(user);
    })
    .catch(error => {
      sendUserError(
        500,
        '{ error: "The user information could not be retrieved." }',
        res
      );
    });
});

router.get("/users/posts/:id", (req, res) => {
  const { id } = req.params;
  dbUsers
    .getUserPosts(id)
    .then(posts => {
      if (posts.length === 0) {
        sendUserError(
          404,
          '{ message: "The posts with the specified ID does not exist." }',
          res
        );
        return;
      }
      res.json(posts);
    })
    .catch(error => {
      sendUserError(
        500,
        '{ error: "The post information could not be retrieved." }',
        res
      );
    });
});

router.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  dbUsers
    .remove(id)
    .then(user => {
      if (user === 0) {
        sendUserError(
          404,
          '{ message: "The user with the specified ID does not exist." }',
          res
        );
        return;
      }
      res.json({ success: `User with the id: ${id} has been removed` });
    })
    .catch(error => {
      sendUserError(500, '{ error: "The user could not be removed" }', res);
      return;
    });
});

router.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  //   console.log(req);
  if (!name) {
    sendUserError(
      400,
      '{ errorMessage: "Please provide title and contents for the post." }',
      res
    );
    return;
  }

  dbUsers.update(id, { name }).then(response => {
    if (response === 0) {
      sendUserError(
        404,
        '{ message: "The user with the specified ID does not exist." }',
        res
      );
      return;
    }
    dbUsers
      .getById(id)
      .then(user => {
        if (user.length === 0) {
          sendUserError(404, "User with that id not found", res);
          return;
        }
        res.status(201).json(user);
      })
      .catch(error => {
        sendUserError(
          500,
          '{ error: "The user information could not be modified." }',
          res
        );
        return;
      });
  });
});

module.exports = router;
