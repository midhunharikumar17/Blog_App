
const Post = require("../models/postModel");
const Like = require("../models/likeModel");
const Comment = require("../models/commentModel");

// const { post } = require('../routes/postRoutes');

// CREATE POST
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = new Post({
      title,
      content,
      author: req.user.id 
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//GET ALL POSTS
exports.getAllPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("author", "name")
    .lean();

  const userId = req.user.id;

  for (let post of posts) {
    post.likesCount = await Like.countDocuments({ post: post._id });
    post.commentsCount = post.comments?.length || 0;

    const liked = await Like.findOne({
      post: post._id,
      user: userId
    });

    post.isLiked = !!liked;
  }

  res.json(posts);
} 


//GET ONE POST
exports.getPost = async (req, res) => {
  const post =await Post.findById(req.params.id).populate("author", "name email");
  if(!post){
    return res.status(404).json({message: "Post not found"});
  }
  res.json(post);
};

//GET USERS POST
exports.getUserPost = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id });
    
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//Update Post
exports.updatePost = async (req,res) => {
  const post = await Post.findById(req.params.id);

  if(!post) return res.status(404).json({messsage: "Post not found"});

  if(post.author.toString() !== req.user.id && req.user.role !== "admin"){
    return res.status(403).json({message:"Unauthorized"});
  }
  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;

  await post.save();

  res.json({message: "Post updated Successfully", post});
};

//DELETE POST
exports.deletePost = async (req, res) => {

  const post= await Post.findById(req.params.id);

  if(!post) return res.status(404).json({message: "Post not found"});
  if(post.author.toString() !== req.user.id && req.user.role !== "admin"){
    return res.status(403).json({message: "Unauthorized"});
  }

  await post.deleteOne();

  res.json({message: "Post deleted successfully"});

}