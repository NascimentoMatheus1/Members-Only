const express = require('express');
const passport = require('passport');
const expressSession = require('express-session');
const pgPool = require('../src/db/pool');
const indexRouter = require('./routes/indexRouter.js');
const userRouter = require('./routes/userRouter.js');
const messageRouter = require('./routes/messageRouter.js');
const path = require('path');
const app = express();

// VIEW ENGINE CONFIG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static files folder - Middleware
app.use(express.static(path.join(__dirname, 'public')));

// Parsing - Middleware
app.use(express.json());
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
        cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    }),
);

// Passport Authentication - Middleware
require('./config/passport.js');
app.use(passport.initialize());
app.use(passport.session());

// ROUTES
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/message', messageRouter);

module.exports = app;
