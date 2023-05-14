const express = require('express');
const router = new express.Router();
const PageController = require('../controller/page-controller')



//strona głowna
router.get('/', PageController.home);








module.exports = router;