const http = require("http");
const app = require("./app");
const server = http.createServer(app);
const dotenv = require('dotenv').config();

// server listening 
server.listen(process.env.API_PORT, () => {
  console.log(`Server running on port ${process.env.API_PORT}`);
});