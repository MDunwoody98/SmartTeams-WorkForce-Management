// Importing required modules
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

// parse env variables
require('dotenv').config();

require("./helpers/db/mongodb.js")();

// Configuring port
const port = process.env.PORT || 9000;

const app = express();

// Configure middlewares
// Cross Origin Resource Sharing - CORS adds headers stating that your API accepts requests coming from other origins
app.use(cors());
// Accept JSON format
app.use(express.json());
//Helmet to enhance API security
app.use(helmet());
//Morgan to log HTTP requests
app.use(morgan('combined'));

app.set('view engine', 'html');

// Static folder
app.use(express.static(__dirname + '/views/'));

// Defining route middleware
app.use('/api', require('./routes/api'));

// Listening to port
app.listen(port);
console.log(`Listening On http://localhost:${port}/api`);

module.exports = app;
