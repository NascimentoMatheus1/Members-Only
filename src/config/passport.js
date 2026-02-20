const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pgPool = require('../db/pool');
const bcrypt = require('bcrypt');

const verifyCallback = async (username, password, done) => {
    try {
        const res = await pgPool.query(
            'SELECT * FROM users WHERE username = $1',
            [username],
        );
        if (res.rows.length === 0) {
            return done(null, false);
        }

        const user = res.rows[0];
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error);
    }
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
    try {
        const res = await pgPool.query('SELECT * FROM users WHERE id = ($1)', [
            userId,
        ]);

        if (res.rows.length === 0) {
            return done(null, false);
        }

        const user = res.rows[0];

        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
