const express = require("express")
const router = express.Router()

const likes = require("../Controllers/likesControllers")


//api that toggles the like status of a story
router.post("toggle", likes.togglelike)

module.exports = router