require("./config/database").connect();
const express = require("express");
const dotenv = require('dotenv').config();
const cors = require("cors") //Newly added
const app = express();

app.use(cors()) // Newly added

app.use(express.json({ limit: "50mb" }));

app.use(express.json());

const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const movieRoute = require('./routes/movies')
const listRoute = require('./routes/lists')

app.use('/api/auth', authRoute)

app.use('/api/users', userRoute)

app.use('/api/movies', movieRoute)

app.use('/api/lists', listRoute)


module.exports = app;