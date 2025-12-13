const express = require("express");
const router = express.Router();
const likeController = require("../controllers/likeController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/:postId", authMiddleware, likeController.likePost);
router.delete("/:postId", authMiddleware, likeController.unlikePost);
router.get("/:postId", likeController.getLikes);

module.exports = router;