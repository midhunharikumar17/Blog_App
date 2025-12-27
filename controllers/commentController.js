const Comment = require("../models/commentModel");

exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId
    })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    console.error("GET COMMENTS ERROR:", err);
    res.status(500).json({ message: "Failed to load comments" });
  }
};

exports.addComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user.id,
      content: req.body.content
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error("ADD COMMENT ERROR:", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

exports.deleteComment = async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.json({ message: "Comment deleted" });
};
