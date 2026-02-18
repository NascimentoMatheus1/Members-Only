const db = require('../db/queries');
const bcrypt = require('bcrypt');
const { body, validationResult, matchedData } = require('express-validator');

const getNewUser = (req, res) => {
    res.render('pages/sign_up', { title: 'Sign Up' });
};

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
            minLength: 8,
            minLowercase: 1,
            minNumbers: 1,
            minUppercase: 1,
            minSymbols: 1,
        })
        .withMessage(
            'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.',
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

            res.redirect('/');
        } catch (error) {
            console.log(error.message);
        }
    },
];

module.exports = { getNewUser, saveNewUserPost };
