const db = require('../db/userQueries');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { body, validationResult, matchedData } = require('express-validator');
const { isAuth } = require('../middlewares/authMiddleware');

// GET routes

const getNewUser = (req, res) => {
    res.render('pages/sign_up', { title: 'Inscrever-se' });
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
    res.render('pages/login_form', { title: 'Entrar' });
};

//  POST routes
const checkLoginPOST = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);

        if (!user) {
            return res.render('pages/login_form', {
                title: 'Falha no login',
                errors: [{ msg: 'Usuário ou Senha incorretos!' }],
            });
        }

        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect('/');
        });
    })(req, res, next);
};

// Middleware - Validate new user form inputs
const validateNewUser = [
    body('firstname')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Por favor, digite seu nome.')
        .isAlpha('pt-BR', { ignore: ' ' })
        .withMessage('O nome deve conter apenas letras.')
        .isLength({ min: 3, max: 100 })
        .withMessage('O nome deve ter entre 3 e 100 caracteres.'),
    body('lastname')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Por favor, digite seu sobrenome.')
        .isAlpha('pt-BR', { ignore: ' ' })
        .withMessage('O sobrenome deve conter apenas letras.')
        .isLength({ min: 3, max: 100 })
        .withMessage('O sobrenome deve ter entre 3 e 100 caracteres.'),
    body('username')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Por favor, digite seu nome de usuário.')
        .isLength({ min: 3, max: 100 })
        .withMessage('O nome de usuário deve ter entre 3 e 255 caracteres.')
        .custom(async (username) => {
            try {
                const user = await db.getByUsername(username);

                if (user) {
                    throw new Error('Nome de usuário já em uso');
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
        .withMessage('Por favor, insira sua senha.')
        .isStrongPassword({
            minLength: 6,
            minLowercase: 1,
            minNumbers: 1,
            minUppercase: 0,
            minSymbols: 0,
        })
        .withMessage(
            'A senha deve ter no mínimo 6 caracteres e conter pelo menos uma letra minúscula e um número.',
        ),
    body('c_password')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Por favor, confirme sua senha.')
        .custom(
            (c_password, { req: request }) =>
                c_password === request.body.password,
        )
        .withMessage(
            'A senha e a confirmação não coincidem. Por favor, insira-as corretamente.',
        ),
];

const saveNewUserPost = [
    validateNewUser,
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).render('pages/sign_up', {
                    title: 'Preencha todos os campos corretamente.',
                    errors: errors.array(),
                });
            }

            const { firstname, lastname, username, password } =
                matchedData(req);

            const hash = await bcrypt.hash(password, 10);
            await db.createUser(firstname, lastname, username, hash);

            res.redirect('/user/login');
        } catch (error) {
            console.log(error.message);
        }
    },
];

//  --- Protected routes via Authentication ---

// Middleware - check riddle answer input
const validateRiddleAnswer = [
    body('answer')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Por favor, insira a resposta.')
        .custom((answer) => answer.toLowerCase() === 'teclado')
        .withMessage('Resposta incorreta! Por favor, tente novamente.'),
];

const checkMembershipAnswerPOST = [
    isAuth,
    validateRiddleAnswer,
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).render('pages/membership', {
                    title: 'Tente novamente',
                    errors: errors.array(),
                });
            }

            const userID = Number(req.user.id);
            await db.updateUserBecomeMember(req.user.id);

            res.redirect('/');
        } catch (error) {
            console.log(error.message);
        }
    },
];

const getNewMember = [
    isAuth,
    (req, res) => {
        const currentUser = {
            username: req.user.username,
            membership_status: req.user.membership_status,
        };
        res.render('pages/membership', {
            title: 'Torne-se membro',
            currentUser,
        });
    },
];

const getProfile = [
    isAuth,
    async (req, res) => {
        try {
            const currentUser = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                username: req.user.username,
                create_at: req.user.create_at,
                membership_status: req.user.membership_status,
                isAdmin: req.user.admin,
            };

            const posts = await db.selectUserPosts(req.user.id);

            res.render('pages/profile', {
                title: 'Perfil',
                currentUser,
                posts,
            });
        } catch (error) {
            console.log(error.message);
        }
    },
];

module.exports = {
    getNewMember,
    getNewUser,
    getLoginForm,
    getLogout,
    getProfile,
    saveNewUserPost,
    checkMembershipAnswerPOST,
    checkLoginPOST,
};
