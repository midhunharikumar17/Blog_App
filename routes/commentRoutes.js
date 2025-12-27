const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const commentController = require("../controllers/commentController");

router.get("/post/:postId", commentController.getCommentsByPost);
router.post("/post/:postId", auth, commentController.addComment);
router.delete("/:id", auth, commentController.deleteComment);

module.exports = router;  