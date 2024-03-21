// external imports
const express = require("express")
const router = express.Router()

// internal imports
const usersController = require("../Controllers/usersControllers")

// routes
router.post("/register", usersController.register)
router.get("/profile", usersController.profile)
router.put("/updateProfile", usersController.updateProfile)
router.delete("/delete", usersController.deleteUser)

// exports
module.exports = router