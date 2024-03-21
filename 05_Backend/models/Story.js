const mongoose = require("mongoose")
const Users = require("../models/User")

const Story = new  mongoose.Schema({
    prompt:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Prompt"
    },
    currentContributor:{
        ty
    }
    content:[
        {
            text:{
                type:String,
            },
            contributor:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            date:{
                type:Date,
            },
            upvotes: {
                type: Number,
                default: 0,
              },
              downvotes: {
                type: Number,
                default: 0,
              },
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },

    isPrivate: {
        type: Boolean,
        default: false // Public by default
    },
    contributors: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: [], // Initialize as an empty array
        required: function() {
            return this.isPrivate; // Required if story is private
        }
    }
})

module.exports = {Story}