const express = require("express");
const router = express.Router();


const story = require("../Controllers/storyContollers")

router.get("/all",story.getall)
router.get("/:id",story.getOne)
router.post('/add',story.create);