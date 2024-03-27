const Story = require("../models/Story")
const Prompt = require("../models/Prompt")
const dayjs = require('dayjs')
//import dayjs from 'dayjs' // ES 2015
dayjs().format()
const { decodeToken } = require("../utility/utility")
const User = require("../models/User")

/**
 * API that gets all the stories from the database
 * @param {*} req 
 * @param {*} res 
 * @returns all stories from database
 */
const all = async (req, res) => {
    try {
        const stories = await Story.find().populate('contributors')
        res.status(200).json({ status: 'success', data: { stories } })
    } catch (err) {
        console.error('Error fetching stories:', err)
        res.status(500).json({ status: 'error', message: 'Internal server error' })
    }
}


/**
 * API to get in the database
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const story = async (req, res) => {
    try {
        // Check if the ID parameter is provided
        const storyId = req.query.id
        if (!storyId) {
            return res.status(400).json({ message: "Story ID is required" })
        }

        // Find the story by ID
        const story = await Story.findById(storyId).populate('contributors')

        // Check if the story exists
        if (!story) {
            return res.status(404).json({ message: "Story not found" })
        }

        // Respond with the story
        res.status(200).json({ status: 'success', data: { story } })
    } catch (err) {
        // Handle errors
        console.error('Error fetching story:', err)
        res.status(500).json({ status: 'error', message: 'Internal server error' })
    }
}


/**
 * Api to create new story. It also creates prompt at the same time
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const create = async (req, res) => {

    try {
        const token = req.headers.authorization

        //token is present or not
        if (!token) {
            return res.status(401).json({ message: 'Authorization token is missing.' })
        }

        //username in token is in db or not
        const decodedToken = decodeToken(token)
        if (!decodedToken || !decodedToken.username) {
            return res.status(401).json({ message: 'Invalid authorization token.' })
        }


        const userExists = await User.find({ username: decodedToken.username })

        //title of the story is required
        const title = req.body.title
        if (!title) {
            return res.status(400).json({ message: 'Title cannot be empty.' })
        }

        //description of the story is also mandatory
        const description = req.body.description
        if (!description) {
            return res.status(400).json({ message: 'Description cannot be empty.' })
        }

        //takein current date
        const currentDate = new Date().toISOString() // Get current date in ISO format

        // Pormpt Creation
        const prompt = {
            title: req.body.title,
            description: req.body.description,
            creator: userExists.username,
            date: currentDate
        }

        //creating new prompt as document in the database
        const promptdb = await Prompt.create(prompt)

        const fetched_prompt = await Prompt.find({ title: prompt.title })
        console.log('Prompt created successfully:', fetched_prompt[0])

        //story creation
        const story = {
            prompt: fetched_prompt[0].id,
            title: req.body.title,
            createdAt: currentDate,
            isPrivate: req.body.isPrivate,
            contributors: req.body.contributors ? [userExists.id, req.body.contributors] : [],
            content: []
        }

        //retriving the created story to send as a response
        const createdStory = await Story.create(story)
        console.log(createdStory);
        // sending story as a response
        res.status(201).json({ status: 'created', story: createdStory })


    } catch (err) {
        console.error('Error creating story:', err)
        res.status(500).json({ message: 'Internal server error.' })
    }
}

/**
 * API that adds text to a already created story
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const add = async (req, res) => {
    try {
        const storyId = req.query.id

        //Authentication
        const token = req.header('Authorization')
        if (!token) {
            return res.status(401).json({ message: 'Authorization token is missing.' })
        }

        //Authorization
        const decodedToken = decodeToken(token)
        if (!decodedToken || !decodedToken.username) {
            return res.status(401).json({ message: 'Invalid authorization token.' })
        }

        //Checking if the story exists or not 
        const story = await Story.findById(storyId)
        console.log(story)
        if (!story) {
            return res.status(404).json({ message: 'Story not found.' })
        }
        // console.log(typeof( story.content.contributor))
        //If the story is public then allow anyone to add to it
        //if it is private, then check is the current user is one of the constributor or not
        if (story.isPrivate === true) {
            if (!(decodedToken in story.contributors)) {
                return res.status(403).send("You are not authorized to perform this action.")
            }
        }

        // Get current date in ISO format
        const currentDate = new Date().toISOString()

        const contents = story.content
        contents.forEach(element => {
            if (element.contributor === decodeToken.username
                && element.date == currentDate) {
                res.status(300).send(`You have already contributed today. Please contribute tomorrow.`)
            }
        });


        //collecting the contents to be added from the body
        const newContent = {
            text: req.body.text,
            contributor: decodedToken.id,
            date: currentDate,
            upvotes: 0,
            downvotes: 0
        }
        console.log(story.content);
        story.content = newContent
        console.log(story.content);
        story.markModified('content') // Tell Mongoose that we changed the array

        const savedStory = await story.save()
        const addedContent = savedStory.content[savedStory.content.length - 1]

        res.status(201).json({ message: 'Content added successfully.', content: addedContent })
    } catch (err) {
        console.error('Error adding content:', err)
        res.status(500).json({ message: 'Internal server error.' })
    }
}


module.exports = { all, story, create, add }