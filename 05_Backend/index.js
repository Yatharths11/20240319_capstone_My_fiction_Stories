// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();


// Create an instance of the Express application
const app = express()

app.use(bodyParser.json());

// Define routes
//Auth Routes - Login and Logout
const authRoutes = require("./routes/authRoutes.js")
//User Routes - Register
const userRoutes = require("./routes/userRoutes.js")
//Story Routes- Get All, Get One, Put One
const storyRoutes = require("./routes/storyRoutes.js")

// Connect to MongoDB asynchronously
const connectToMongoDB = async () => {
    try {
      await mongoose.connect(process.env.URI);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1); // Exit the process if unable to connect
    }
  };

  app.use("/auth", authRoutes);
  app.use("/users",userRoutes);

  // Start the server after connecting to MongoDB
const startServer = async () => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  };

// Call the asynchronous functions
connectToMongoDB().then(startServer);