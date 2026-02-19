const { Router } = require('express');
const userControler = require('../controllers/userControler');

const router = Router();

router.get('/', (req, res) => {
    res.render('pages/index', {
        title: 'Home',
    });
});
router.get('/membership', userControler.getNewMember);
router.get('/sign-up', userControler.getNewUser);
router.get('/login', userControler.getLoginForm);
router.post('/sign-up/save', userControler.saveNewUserPost);
router.post('/membership/check', userControler.checkMembershipAnswerPOST);
router.post('/login', userControler.checkLoginPOST);

module.exports = router;
