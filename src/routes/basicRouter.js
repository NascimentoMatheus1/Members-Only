const { Router } = require('express');
const userControler = require('../controllers/userControler');

const router = Router();

router.get('/', (req, res) => {
    res.render('pages/index', {
        title: 'Home',
        currentUser: { name: 'matheus', membership_status: false },
    });
});
router.get('/membership', userControler.getNewMember);
router.get('/sign-up', userControler.getNewUser);
router.post('/sign-up/save', userControler.saveNewUserPost);
router.post('/membership/check', userControler.checkMembershipAnswerPOST);

module.exports = router;
