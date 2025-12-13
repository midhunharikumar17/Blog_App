const express= require("express");
const router =express.Router();

const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// const adminOnly = require("../middleware/adminMiddleware");
const adminController =require("../controllers/adminController");

//Admin Dashboard 
router.get("/dashboard", auth, authorizeRoles("admin"), (req, res) => 
  {
  res.json({
    message: "Welcome Admin!",
    user: req.user
  });
});

//ADMIN STATS
router.get("/stats", auth, authorizeRoles("admin"),adminController.getStats);

//USER Management 
router.get("/users",auth, authorizeRoles("admin"), adminController.getAllUsers);
router.delete("/users/:id" ,auth, authorizeRoles("admin"),adminController.deleteUser);
router.put("/users/deactivate/:id",auth, authorizeRoles("admin"), adminController.deactivateUser);
router.put("/users/reactivate/:id", auth, authorizeRoles("admin"), adminController.reactivateUser);


//POST Management
router.get("/posts",auth, authorizeRoles("admin"),adminController.getAllPosts)
router.put("/posts/:id", auth, authorizeRoles("admin"), adminController.editPost);
router.delete("/posts/:id",auth ,authorizeRoles("admin"), adminController.deletePost);

//Comment Management
router.get("/comments", auth ,authorizeRoles("admin"), adminController.getAllComments);
router.delete("/comments/:id", auth, authorizeRoles("admin"), adminController.deleteComment)

module.exports = router;