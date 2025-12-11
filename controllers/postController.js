const Post = require('../models/postModel');

// CREATE POST
exports.createPost = async (req, res) => {
  try{
    const {title, content} =req.body;

    const post= new Post({
      title,
      content,
      author: req.user.id,
    });

    await post.save();

    res.status(201).json({ message: "Post created", post });
  }catch(err){
    res.status(500).json({error: err.message});
  }
};

//GET ALL POSTS
exports.getAllPosts = async (req, res) => {
  const posts = await Post.find().populate("author", "name email");
  res.json(posts);
};

//GET ONE POST
exports.getPost = async (req, res) => {
  const post =await Post.findById(req.params.id).populate("author", "name email");
  if(!post){
    return res.status(404).json({message: "Post not found"});
  }
  res.json(post);
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