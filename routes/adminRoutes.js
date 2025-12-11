const express= require("express");
const router =express.Router();
const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const adminController =require("../controllers/adminController");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/dashboard", auth, adminOnly, (req, res) => {
  res.json({
    message: "Welcome Admin!",
    user: req.user
  });
});

//only admin can access these routes
router.get("/users",auth, authorizeRoles("admin"), adminController.getAllUsers);
router.delete("/user/:id" ,auth, authorizeRoles("admin"),adminController.deleteUser);
router.delete("/post/:id", auth, authorizeRoles("admin"), adminController.deletePost);
router.delete("/comment/:id", auth, authorizeRoles("admin"), adminController.deleteComment)


module.exports = router;