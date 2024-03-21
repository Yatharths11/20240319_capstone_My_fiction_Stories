const express = require("express")
const router = express.Router()


const story = require("../Controllers/storyContollers")

router.get("/all",story.all)
router.get("/:id",story.story)
router.post('/add',story.add)
router.post("/create",story.create)

module.exports = router