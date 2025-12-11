const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const {
  addComment,
  deleteComment,
} =require('../controllers/commentController');

//add comment
router.post("/:postId", auth, addComment);

//delete comment
router.delete("/:id", auth, deleteComment);

module.exports = router;  