const { Router } = require('express');
const userControler = require('../controllers/userControler');

const router = Router();

router.get('/', userControler.getIndexPage);
router.get('/sign-up', userControler.getNewUser);

router.get('/login', userControler.getLoginForm);
router.get('/logout', userControler.getLogout);

router.post('/sign-up/save', userControler.saveNewUserPost);
router.post('/login', userControler.checkLoginPOST);

// Protected routes via Authentication
router.get('/membership', userControler.getNewMember);
router.get('/profile', userControler.getProfile);
router.post('/membership/check', userControler.checkMembershipAnswerPOST);

module.exports = router;
