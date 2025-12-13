const Like = require ("../models/likeModel");
const Post = require("../models/postModel");

//like a post
exports.likePost = async (req, res) => {
  try{
    const postId =req.params.postId;
    const userId = req.user.id;

    const alreadyLiked = await Like.findOne({ post: postId, user: userId });
    if (alreadyLiked) {
      return res.status(400).json({ message: "Post already liked" });
    }

    const like = new Like({
      post:postId,
      user: userId,
    });

    await like.save();
    res.status(201).json({message:"post liked"});

  }catch(err){
    if(err.code ===11000){
      return res.status(400).json({message: "you have already liked this post"});
   }
   res.status(500).json({error:err.message});
  }
};

//unlike a post
exports.unlikePost = async (req, res)=>{
  try{
    const postId= req.params.postId;
    const userId = req.user.id;


    const like = await Like.findOne({
      post: postId,
      user: userId,
    });

    if(!like)
      return res.status(404).json({message: "like not found"});

    await like.deleteOne();
    res.json({message: "post unliked successfully"});
    
    
  }catch(err){
    res.status(500).json({error: err.message});
  }
};

// get like count for a post
exports.getLikes = async (req, res)=>{
  try{
    const postId = req.params.postId;
    const likeCount = await Like.countDocuments({post: postId});
    const users = await Like.find({post: postId}).populate(
      "users",
      "name email"
    );
    res.json({likeCount, users});
  } catch(err){
    res.status(500).json({error:err.message});
  }
};