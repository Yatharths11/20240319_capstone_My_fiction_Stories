// external imports
const express = require("express");
const router = express.Router();

// internal imports
const users = require("../Controllers/usersControllers");

// routes
router.post("/register", users.register);
// router.get("/profile", userController.info);
// router.put("/update", userController.update);
// router.delete("/delete", userController.deleteUser);

// exports
module.exports = router;