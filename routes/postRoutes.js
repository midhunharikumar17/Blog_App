const express =require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const{
    createPost,
    getAllPosts,
    getPost,
    updatePost,
    deletePost,
    getUserPost
} = require('../controllers/postController');


//get users post
router.get("/user",auth, getUserPost);

//CREATE POST
router.post("/",auth, createPost);

//get all posts
router.get("/",auth, getAllPosts);

//get one post
router.get("/:id", getPost);

//update post
router.put("/:id", auth, updatePost);

//delete post
router.delete("/:id", auth, deletePost);

module.exports =router;