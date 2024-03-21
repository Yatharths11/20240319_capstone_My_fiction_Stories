const Story = require("../models/Story")
const Prompt = require( "../models/Prompt");
const dayjs = require('dayjs')
//import dayjs from 'dayjs' // ES 2015
dayjs().format()
const { decodeToken } = require("../utility/utility");
/**
 * API that gets all the stories from the database
 * @param {*} req 
 * @param {*} res 
 * @returns all stories from database
 */
const getall = async (req,res)=>{
    try {
        const stories = await Story.find().populate('contributors');
        res.status(200).json({ status: 'success', data: { stories } });
    } catch (err) {
        console.error('Error fetching stories:', err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}


/**
 * API to get in the database
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getOne = async (req,res)=>{
    try {
        // Check if the ID parameter is provided
        const storyId = req.query.id;
        if (!storyId) {
            return res.status(400).json({ message: "Story ID is required" });
        }

        // Find the story by ID
        const story = await Story.findById(storyId).populate('contributors');

        // Check if the story exists
        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }

        // Respond with the story
        res.status(200).json({ status: 'success', data: { story } });
    } catch (err) {
        // Handle errors
        console.error('Error fetching story:', err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}

const create = async (req,res)=>{

    const token = req.header.authorization
    const decodedtoken = decodeToken(token)
    const day = dayjs()

    const title = req.body.title;
    if(!title){
        res.status(403).json("Title cannot be empty.")
    }

    const description = req.body.description
    if(!description){
        res.status(403).json("Description cannot be empty.")
    }

    let prompt = {
        title:req.body.title,
        descrption:req.body.descrption,
        creator: decodedtoken.username,
        date:$`${day.$D}-${day.$M + 1}-${day.$y}`
    }

    const promptdb = await Prompt.create(prompt)

    let story = {
        prompt : promptdb.id,
        createdAt: new Date().String(),
        isPrivate: req.body.isPrivate,
        contributors: req.body.contributors? [decodedtoken.username]: [],
        content:{
            text:"",
            contributor:"",
            date:"",
            upvotes:"",
            downvotes:""
        }
    }
    
    await Story.create(story)
    .then((data)=> {
       res.status(201).json({status:'created', id: data._id})
    })
}

const add = async (req, res) => {
    try {
        const storyId = req.params.id;
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ message: 'Authorization token is missing.' });
        }
        
        const decodedToken = decodeToken(token);
        if (!decodedToken || !decodedToken.username) {
            return res.status(401).json({ message: 'Invalid authorization token.' });
        }

        const story = await Story.findById(storyId);
        if (!story || !story.contributors.includes(decodedToken.username)) {
            return res.status(404).json({ message: 'Story not found or you are not a contributor in this story.' });
        }

        const currentDate = new Date().toISOString(); // Get current date in ISO format

        const newContent = {
            text: req.body.text,
            contributor: decodedToken.username,
            date: currentDate,
            upvotes: 0,
            downvotes: 0
        };

        story.content.push(newContent);
        story.markModified('content'); // Tell Mongoose that we changed the array

        const savedStory = await story.save();
        const addedContent = savedStory.content[savedStory.content.length - 1];

        res.status(201).json({ message: 'Content added successfully.', content: addedContent });
    } catch (err) {
        console.error('Error adding content:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};



module.exports = {getall, getOne, create}