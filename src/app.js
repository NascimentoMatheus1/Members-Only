const express = require('express');
const router = require('./routes/basicRouter');
const path = require('path');
const app = express();

// VIEW ENGINE CONFIG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// ROUTES
app.use('/', router);

module.exports = app;
