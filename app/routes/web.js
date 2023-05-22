const express = require('express');
const router = new express.Router();
const PageController = require('../controller/page-controller');
const UserController = require('../controller/user-controller');
const authMiddleware = require('../db/middlewares/is-auth');




//strona głowna
//router.get('/', PageController.home);


//strona glowna do logowania-ok
router.get('/zaloguj', PageController.home);//wyswietlenie formularza
router.post('/zaloguj', UserController.login); //faktyczne logowanie
router.post('/token',UserController.getRefreshToken);

//Rejestracja
router.get('/zarejestruj', UserController.showRegister);
router.post('/zarejestruj', UserController.register);

//Panel admina
router.get('/admin',authMiddleware, UserController.adminPage);

//wylogowywanie
router.get('/wyloguj', UserController.logout)

//edycja profilu
router.get('/admin/edytujprofil',authMiddleware, UserController.showEditUserProfile);
router.post('/admin/edytujprofil',authMiddleware, UserController.updateProfile);


router.get('/admin/kalendarz',authMiddleware, UserController.calendar)


module.exports = router;