const { Router } = require('express');
const userControler = require('../controllers/userControler');

const router = Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});
router.get('/sign-up', userControler.getNewUser);
router.post('/sign-up/save', userControler.saveNewUserPost);

module.exports = router;
