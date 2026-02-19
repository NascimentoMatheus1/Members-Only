const express = require('express');
const expressSession = require('express-session');
const pgPool = require('../src/db/pool');
const router = require('./routes/basicRouter');
const path = require('path');
const app = express();

// VIEW ENGINE CONFIG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static files folder - Middleware
app.use(express.static(path.join(__dirname, 'public')));

// Form Parsing - Middleware
app.use(express.urlencoded({ extended: true }));

// Session - Middleware
const pgSession = require('connect-pg-simple')(expressSession);
app.use(
    expressSession({
        store: new pgSession({
            pool: pgPool,
            tableName: 'session',
        }),
        secret: process.env.FOO_COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 },
    }),
);

// ROUTES
app.use('/', router);

module.exports = app;
