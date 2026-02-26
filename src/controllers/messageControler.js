const db = require('../db/messageQueries');
const { body, validationResult, matchedData } = require('express-validator');
const { isMember } = require('../routes/authMiddleware');

const getNewMessage = [
    isMember,
    (req, res) => {
        res.render('pages/newMessage_form', { title: 'New Message' });
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
    isMember,
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
