const Comment = require('../models/commentModel');



//Add comment
exports.addComment = async(req, res) => {
  try{
    const {content}=req.body;
    const postId = req.params.postId;

    const comment= new Comment({
      post: postId,
      user: req.user.id,
      content,
    });

    await comment.save();
    res.status(201).json({message: "Comment added", comment});
  }catch(err){
    res.status(500).json({error:err.message});
  }
};

//delete comment
exports.deleteComment =async(req, res) =>{
  try{
    const comment = await Comment.findById(req.params.id);

    if(!comment)
      return res.status(404).json({message: "Comment not found"});

    if (!comment.user)
      return res.status(400).json({ message: "Comment has no user field" });
    
    if(comment.user.toString() !==req.user.id && req.user.role !=="admin"){
      return res.status(403).json({ message: "Unauthorized" });
    }
    await comment.deleteOne();
    res.json({message: "Comment deleted"});
  }catch (err) {
    res.status(500).json({ error: err.message });
  }
};