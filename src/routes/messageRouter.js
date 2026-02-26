const { Router } = require('express');
const messageControler = require('../controllers/messageControler');

const router = Router();

router.use('/new', messageControler.getNewMessage);
router.post('/save', messageControler.postSaveNewMessage);

module.exports = router;
