const router = require('express').Router()
const User = require('../models/User')

const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs');

//REGISTER
router.post("/register", async (req, res) => {

    // Our register logic starts here
     try {
      // Get user input
      const { username, email, password, isAdmin } = req.body;
  
      // Validate user input
      if (!(email && password && username && isAdmin)) {
        res.status(400).send("All input is required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ email });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }

      //Encrypt user password
      encryptedUserPassword = await bcrypt.hash(password, 10);
      console.log(password, encryptedUserPassword)
  
      // Create user in our database
      const user = await User.create({
        username: username,
        email: email.toLowerCase(), // sanitize
        password: encryptedUserPassword,
        isAdmin: isAdmin,
      });
  
      // Create token
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.TOKEN_KEY,
        {
          expiresIn: "5h",
        }
      );
      // save user token
      user.token = token;
  
      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });

//LOGIN
router.post("/login", async (req, res) => {
    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
    
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });
    
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin},
          process.env.TOKEN_KEY,
          {
            expiresIn: "5h",
          }
        );
    
        // save user token
        user.token = token;
        console.log(user)
        // user
        return res.status(200).json(user);
      }
      return res.status(400).send("Invalid Credentials");
      
    // Our login logic ends here
    } catch (err) {
      console.log(err);
    }
    // Our login logic ends here
    });

module.exports = router