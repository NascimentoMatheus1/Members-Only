const { Router } = require('express');
const indexControler = require('../controllers/indexControler');

const router = Router();

router.get('/', indexControler.getIndexPage);

module.exports = router;
