const Post = require("../models/postModel");
const User = require("../models/userModel");

exports.search = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json({ users: [], posts: [] });

    // 1️⃣ Find matching users
    const users = await User.find({
      name: { $regex: q, $options: "i" }
    }).select("_id name email");

    // 2️⃣ Find matching posts
    const posts = await Post.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
        { author: { $in: users.map(u => u._id) } } // 🔥 THIS IS KEY
      ]
    })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json({ users, posts });

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Search failed" });
  }
};