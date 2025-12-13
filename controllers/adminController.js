const User= require("..//models/userModel");
const Post =require('../models/postModel');
const Comment =("../models/commentModel");
const Like = require("../models/likeModel");

//ADMIN DASHBOARD
exports.getStats = async (req, res)=>{
  try{
    const users = await User.countDocuments();
    const posts = await Post.countDocuments();
    const comments = await Comment.countDocuments();
    const likes = await Like.countDocuments();

    res.json({
      users,posts,comments,likes
    });

  }catch(err){
    res.status(500).json({error: err.message});
  }
};

//get all users
exports.getAllUsers =async(req, res) =>{
  try{
    const users = await User.find().select("-password");
    res.json(users);
  }catch(err){
    res.status(500).json( {error: err.message});
  }
};

//Deactivate a user
exports.deactivateUser = async (req, res)=>{
  try{
    const user = await User.findByIdAndUpdate(req.params.id, {active: false});
    if(!user)
      return res.status(404).json({message: "user not found"});
    res.json({message: "user deactivated successfully"});
  }catch(err){
    res.status(500).json({error: err.message});
  }
};

//Reactivate a User
exports.reactivateUser = async (req, res)=>{
  try{
    const user = await User.findByIdAndUpdate(req.params.id , {active: true});
    if(!user)
      res.json(404).json({message: "user not found"});
    res.json({message: "user reactivated successfully"});
  }catch(err){
    res.status(500).json({error:err.message});
  }
};

//delete a user
 exports.deleteUser = async(req, res) =>{
  try{
    const user = await User.findById(req.params.id);
    if(!user)
      return res.status(404).json({message: "user not found"});

    await user.deleteOne();
    res.json({message: "user deleted successfully"});
  }catch(err){
    res.status(500).json({error: err.message});
  }
 };

 //Get all posts
 exports.getAllPosts = async (req, res) =>{
  try{
    const posts = await Post.find().populate("author", "name email");
    res.json(posts);
  }catch(err){
    res.status(500).json({error:err.message});
  }
 }

 //Edit any post
 exports.editPost = async(req, res) =>{
  try{
    const updated =  await Post.findByIdAndUpdate(
      req.params.id,
    req.body,
    {new: true} 
  );
    if(!updated)
      res.status(404).json({message: "No posts found"});
  res.json({message: "Post Updated Successfully", updated});
  }catch(err){
    res.status(500).json({error: err.message});
  }
 };

 //delete any post
 exports.deletePost = async(req, res) =>{
  try{
    const post =await post.findById(req.params.id);
    if(!post)
      return res.status(404).json({message:"post not found"});

    await post.deleteOne();
    res.json({message:"post deleted successfully by admin"});
  }catch(err){
    res.status(500).json({error: err.message});
  }
 };

//Get all comments
exports.getAllComments = async (req, res) => {
  try{
    const comments = await Comment.find()
    .populate(" user", "name email")
    .populate("post", "title");

    res.json(comments);
  }catch(err){
    res.status(500).json({error:err.message});
  }
};

 //delete any comment
 exports.deleteComment = async (req, res) =>{
  try{
    await Comment.findById(req.params.id);
    if(!comment)
      return res.stauts(404).json({message: "comment not found"})

    await comment.deleteOne();
    res.json({message:"comment deleted successfully by admin"});

  }catch (err){
    res.status(500).json({error: err.message});
  }
 };