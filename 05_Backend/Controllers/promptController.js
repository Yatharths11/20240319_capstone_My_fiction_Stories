const Prompt =  require("../models/Prompt")
const { decodeToken } = require("../utility/utility")
const User = require('./User')


async function getPromptById(id){

    const prompt = await Prompt.findById(id)
    console.log(prompt)


}

getPromptById('65fbc6bc48dfa91d7535ecc8')