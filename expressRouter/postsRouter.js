const express = require("express");

const dbPosts = require("../data/helpers/postDb");
const router = express.Router();

const sendUserError = (status, message, res) => {
  res.status(status).json({ errorMessage: message });
  return;
};

router.post("/posts/", (req, res) => {
  const { text, user_id } = req.body;
  if (!text || !user_id) {
    sendUserError(400, "Please provide text and user_id for the post.", res);
    return;
  }
  dbPosts
    .insert({
      text,
      user_id
    })
    .then(response => {
      res.status(201).json(response);
    })
    .catch(error => {
      console.log(error);
      sendUserError(
        500,
        `{ error: "There was an error while saving the post to the database" }`,
        res
      );
      return;
    });
});

router.get("/posts/", (req, res) => {
  dbPosts
    .get()
    .then(posts => {
      res.json({ posts });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The posts information could not be retrieved."
      });
    });
});

router.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  dbPosts
    .getById(id)
    .then(post => {
      if (post.length === 0) {
        sendUserError(
          404,
          '{ message: "The post with the specified ID does not exist." }',
          res
        );
        return;
      }
      res.json(post);
    })
    .catch(error => {
      sendUserError(
        500,
        '{ error: "The post information could not be retrieved." }',
        res
      );
    });
});

router.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  dbPosts
    .remove(id)
    .then(post => {
      if (post === 0) {
        sendUserError(
          404,
          '{ message: "The post with the specified ID does not exist." }',
          res
        );
        return;
      }
      res.json({ success: `Post with the id: ${id} has been removed` });
    })
    .catch(error => {
      sendUserError(500, '{ error: "The post could not be removed" }', res);
      return;
    });
});

router.put("/posts/:id", (req, res) => {
  const { id } = req.params;
  const { text, user_id } = req.body;
  //   console.log(req);
  if (!text || !user_id) {
    sendUserError(
      400,
      '{ errorMessage: "Please provide text and user_id for the post." }',
      res
    );
    return;
  }

  dbPosts.update(id, { text, user_id }).then(response => {
    if (response === 0) {
      sendUserError(
        404,
        '{ message: "The post with the specified ID does not exist." }',
        res
      );
      return;
    }
    dbPosts
      .getById(id)
      .then(post => {
        if (post.length === 0) {
          sendUserError(404, "Post with that id not found", res);
          return;
        }
        res.status(201).json(post);
      })
      .catch(error => {
        sendUserError(
          500,
          '{ error: "The post information could not be modified." }',
          res
        );
        return;
      });
  });
});

module.exports = router;
