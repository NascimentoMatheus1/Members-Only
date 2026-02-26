const db = require('../db/messageQueries');
const { body, validationResult, matchedData } = require('express-validator');
const { isAuth } = require('../routes/authMiddleware');

const getNewMessage = [
    isAuth,
    (req, res) => {
        const currentUser = {
            username: req.user.username,
            membership_status: req.user.membership_status,
        };

        res.render('pages/newMessage_form', {
            title: 'New Message',
            currentUser,
        });
    },
];

const validateNewMessage = [
    body('title')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Please input the message title.')
        .isLength({ min: 3, max: 255 })
        .withMessage('Title must be between 3 and 255 characters'),
    body('message')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Please input your message')
        .isLength({ min: 5, max: 1000 })
        .withMessage('Message must be between 5 and 1000 characters'),
    body('username'),
];

const postSaveNewMessage = [
    isAuth,
    validateNewMessage,
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).render('pages/newMessage_form', {
                    title: 'New Message',
                    errors: errors.array(),
                });
            }

            const { title, message } = matchedData(req);

            await db.insertNewMessage(title, message, req.user.id);

            res.redirect('/');
        } catch (error) {
            console.log(error.message);
        }
    },
];

module.exports = { getNewMessage, postSaveNewMessage };
