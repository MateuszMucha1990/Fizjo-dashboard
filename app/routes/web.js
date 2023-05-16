const express = require('express');
const router = new express.Router();
const PageController = require('../controller/page-controller');
const UserController = require('../controller/user-controller');
const authMiddleware = require('../db/middlewares/is-auth')


//strona głowna
//router.get('/', PageController.home);


//Logowanie
//router.get('/zaloguj', UserController.showLogin);
router.get('/zaloguj', PageController.home);
router.post('/zaloguj', UserController.login);


//Rejestracja
router.get('/zarejestruj', UserController.showRegister);
router.post('/zarejestruj', UserController.register);


//panel admina
router.get('/admin',authMiddleware, UserController.dashboard);
router.post('/refresh-token', UserController.getRefreshToken)




module.exports = router;