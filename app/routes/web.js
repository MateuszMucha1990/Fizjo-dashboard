const express = require('express');
const router = new express.Router();
const PageController = require('../controller/page-controller');
const UserController = require('../controller/user-controller');
const PatientController = require('../controller/patient-controller');

const authMiddleware = require('../db/middlewares/is-auth');
const upload =require('../services/uploader')



//strona głowna
//router.get('/', PageController.home);   //TODO ------


//strona glowna do logowania-ok
router.get('/zaloguj', PageController.home);//wyswietlenie formularza
router.post('/zaloguj', UserController.login); //faktyczne logowanie
router.post('/token',UserController.getRefreshToken);

//Rejestracja
router.get('/zarejestruj', UserController.showRegister);
router.post('/zarejestruj', UserController.register);

//Panel admina
router.get('/admin', upload.single('image'), UserController.adminPage);

//wylogowywanie
router.get('/wyloguj', UserController.logout)

//edycja profilu
router.get('/admin/edytujprofil', upload.single('image'), UserController.showEditUserProfile);
router.post('/admin/edytujprofil', upload.single('image'), UserController.updateProfile);

//Pacjenci-glowna
router.get('/admin/pacjenci', PatientController.patientList)

router.get('/admin/pacjenci/dodaj', PatientController.registerPatient);
router.post('/admin/pacjenci/dodaj', PatientController.addPatient)

router.get('/admin/pacjenci/:name/karta', PatientController.patientCard);

router.get('/admin/pacjenci/:name/wizyta', PatientController.patientVisit);
router.post('/admin/pacjenci/:name/wizyta', PatientController.newVisit);

router.get('/admin/pacjenci/:name/:_id', PatientController.editVisit);
router.post('/admin/pacjenci/:name/:_id', PatientController.updateVisit);





//kalendarz
router.get('/admin/kalendarz',authMiddleware, UserController.calendar)  //TODO-----


module.exports = router;