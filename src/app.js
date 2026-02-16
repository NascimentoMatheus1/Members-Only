const express = require('express');
const router = require('./routes/basicRouter');
const path = require('path');
const app = express();

// VIEW ENGINE CONFIG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MIDDLEWARE Static files folder
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.use('/', router);

module.exports = app;
