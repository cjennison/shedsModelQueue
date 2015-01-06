var express = require('express');

// Get configuration
var env = process.env.NODE_ENV || 'development';
var config = null;

// Create express app
var app = express();

// Express config
require('./config/express')(app, config);

module.exports = app;
