const db = require('../db/messageQueries');
const { body, validationResult, matchedData } = require('express-validator');
const { isAuth, isAdmin } = require('../middlewares/authMiddleware');

const getNewMessage = [
    isAuth,
    (req, res) => {
        const currentUser = {
            username: req.user.username,
            membership_status: req.user.membership_status,
        };

        res.render('pages/newMessage_form', {
            title: 'Nova postagem',
            currentUser,
        });
    },
];

const validateNewMessage = [
    body('title')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Por favor, insira o título da mensagem.')
        .isLength({ min: 3, max: 255 })
        .withMessage('O título deve ter entre 3 e 255 caracteres.'),
    body('message')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Por favor, insira sua mensagem.')
        .isLength({ min: 5, max: 1000 })
        .withMessage('A mensagem deve ter entre 5 e 1000 caracteres.'),
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
                    title: 'Nova Postagem',
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

const postDeleteMessage = [
    isAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;
    
            await db.deleteMessage(id);

            res.redirect('/');
        } catch (error) {
            console.log(error.message);
        }
    },
];

module.exports = { getNewMessage, postSaveNewMessage, postDeleteMessage };
