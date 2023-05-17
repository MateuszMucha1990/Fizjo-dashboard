const express = require('express');
const router = new express.Router();
const PageController = require('../controller/page-controller');
const UserController = require('../controller/user-controller');
const authMiddleware = require('../db/middlewares/is-auth')


//strona głowna
//router.get('/', PageController.home);


//strona glowna do logowania-ok
router.get('/zaloguj', PageController.home);//wyswietlenie formularza
router.post('/zaloguj', UserController.login); //faktyczne logowanie



//Logowanie do panelu admina
router.get('/admin',authMiddleware,UserController.showLogin);


//Rejestracja
router.get('/zarejestruj', UserController.showRegister);
router.post('/zarejestruj', UserController.register);


//panel admina
//router.get('/admin',authMiddleware, UserController.dashboard);
router.post('/refresh-token',authMiddleware, UserController.getRefreshToken)




module.exports = router;