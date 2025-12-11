const User= require("..//models/userModel");
const Post =require('../models/postModel');
const Comment =("../models/commentModel");

//get all users
exports.getAllUsers =async(req, res) =>{
  try{
    const users = await User.find().select("-password");
    res.json(users);
  }catch(err){
    res.status(500).json( {error: err.message});
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

 //delete any comment
 exports.deleteComment = async (req, res) =>{
  try{
    const comment = await Comment.findById(req.params.id);
    if(!comment)
      return res.stauts(404).json({message: "comment not found"})

    await comment.deleteOne();
    res.json({message:"comment deleted successfully by admin"});

  }catch (err){
    res.status(500).json({error: err.message});
  }
 };