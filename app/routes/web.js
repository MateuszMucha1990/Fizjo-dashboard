const express = require('express');
const router = new express.Router();
const PageController = require('../controller/page-controller');
const UserController = require('../controller/user-controller');
const authMiddleware = require('../db/middlewares/is-auth')


//strona głowna
router.get('/', PageController.home);



//Rejestracja
router.get('/zarejestruj', UserController.showRegister);
router.post('/zarejestruj', UserController.register);

//Logowanie
router.get('/zaloguj', UserController.showLogin);
router.post('/zaloguj', UserController.login);

//panel admina
router.get('/admin',authMiddleware, UserController.dashboard)





module.exports = router;