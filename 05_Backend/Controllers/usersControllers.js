
const Users = require("../models/User");
const { hashPassword } = require("../utility/utility");
const {check_valid_username,check_valid_password, check_valid_email} = require("../validators/user_validators")



// Register a new user
const register = async (req, res) => {
    try {
      const { username, email, password } = req.body;
        
      const usernameExist = await Users.findOne({username:username})
      if (usernameExist) {
        return res.status(401).json({
          error: "Username already exists. Please try another Username.",
        });
      }
      // Check if username, email, and password are valid
      if (!check_valid_username(username)) {
        return res.status(400).json({
          error:
            "Invalid username. Username must contain only letters, numbers, underscores, and hyphens, and be between 3 to 20 characters long.",
        });
      }
      const emailExist = await Users.findOne({ email: email });
      if (emailExist) {
        return res
          .status(401)
          .json({ error: "Email already exists. Please try another email." });
      }
      if (!check_valid_email(email)) {
        return res.status(400).json({ error: "Invalid email address." });
      }
      
      if (!password) {
        return res.status(400).json({ error: "Password is required." });
      }
      if (!check_valid_password(password)) {
        return res.status(400).json({
          error: "Invalid password. Password must be at least 6 characters long.",
        });
      }
      // Hash the password
      const hashedPassword = await hashPassword(password);
      // Create a new user
      const newUser = await Users.create({
        username: username,
        email: email,
        password: hashedPassword,
      });
  
      res
        .status(201)
        .json({ message: "New user registered successfully.", user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to register new user." });
    }
  };

  module.exports = {register}
