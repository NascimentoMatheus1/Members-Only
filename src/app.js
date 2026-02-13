const express = require('express');
const router = require('./routes/basicRouter');
const app = express();

app.use('/', router);

module.exports = app;
