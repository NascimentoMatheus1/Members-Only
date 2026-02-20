const db = require('../db/queries');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { body, validationResult, matchedData } = require('express-validator');
const { isAuth } = require('../routes/authMiddleware');

// <<<<--->>>> User GET routes <<<<--->>>>

const getIndexPage = (req, res) => {
    if (req.user) {
        const { username, first_name, last_name } = req.user;
        const user = { username, first_name, last_name };
        return res.render('pages/index', {
            title: 'Home Member',
            currentUser: user,
        });
    }
    return res.render('pages/index', {
        title: 'Home',
    });
};

const getNewUser = (req, res) => {
    res.render('pages/sign_up', { title: 'Sign Up' });
};

const getLogout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};

const getLoginForm = (req, res) => {
    res.render('pages/login_form', { title: 'Log in' });
};

//  <<<<<<--->>>>>> User POST routes <<<<--->>>>

const checkLoginPOST = (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/',
    })(req, res, next);
};

// Middleware - Validate new user form inputs
const validateNewUser = [
    body('firstname')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Please input your first name')
        .isAlpha('pt-BR', { ignore: ' ' })
        .withMessage('Fist name must only contain letters.')
        .isLength({ min: 3, max: 100 })
        .withMessage('Fist name be between 3 and 100 characters'),
    body('lastname')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Please input your last name')
        .isAlpha('pt-BR', { ignore: ' ' })
        .withMessage('Last name must only contain letters.')
        .isLength({ min: 3, max: 100 })
        .withMessage('Last name be between 3 and 100 characters'),
    body('username')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Please input your username')
        .isLength({ min: 3, max: 100 })
        .withMessage('Username be between 3 and 255 characters')
        .custom(async (username) => {
            try {
                const user = await db.getByUsername(username);

                if (user) {
                    throw new Error('Username already in use');
                }
                return true;
            } catch (error) {
                throw error;
            }
        }),
    body('password')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Please input your password')
        .isStrongPassword({
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minUppercase: 0,
            minSymbols: 0,
        })
        .withMessage(
            'Password must be at least 6 characters long and contain at least one lowercase letter and one number',
        ),
    body('c_password')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Please Confirm your password')
        .custom(
            (c_password, { req: request }) =>
                c_password === request.body.password,
        )
        .withMessage(
            'The password and its confirmation do not match, please input them correctly.',
        ),
];

const saveNewUserPost = [
    validateNewUser,
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).render('pages/sign_up', {
                    title: 'Fill all inputs correctly.',
                    errors: errors.array(),
                });
            }

            const { firstname, lastname, username, password } =
                matchedData(req);

            const hash = await bcrypt.hash(password, 10);
            await db.createUser(firstname, lastname, username, hash);

            res.redirect('/login');
        } catch (error) {
            console.log(error.message);
        }
    },
];

// Middleware - check riddle answer input
const validateRiddleAnswer = [
    body('answer')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Please input the answer.')
        .custom((answer) => answer.toLowerCase() === 'keyboard')
        .withMessage('Wrong answer ! Please, try again.'),
];

const checkMembershipAnswerPOST = [
    validateRiddleAnswer,
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).render('pages/membership', {
                    title: 'Try again',
                    errors: errors.array(),
                });
            }

            // db.updateUserBecomeMember(currentUser.id);

            res.redirect('/');
        } catch (error) {
            console.log(error.message);
        }
    },
];

//  <<<<--->>>> Protected routes via Authentication <<<<<--->>>>>

const getNewMember = [
    isAuth,
    (req, res) => {
        res.render('pages/membership', { title: 'Become a member' });
    },
];

const getProfile = [
    isAuth,
    (req, res) => {
        const {
            id,
            first_name,
            last_name,
            username,
            create_at,
            membership_status,
        } = req.user;
        const currentUser = {
            id,
            first_name,
            last_name,
            username,
            create_at,
            membership_status,
        };
        res.json({ currentUser });
    },
];

module.exports = {
    getIndexPage,
    getNewMember,
    getNewUser,
    getLoginForm,
    getLogout,
    getProfile,
    saveNewUserPost,
    checkMembershipAnswerPOST,
    checkLoginPOST,
};
