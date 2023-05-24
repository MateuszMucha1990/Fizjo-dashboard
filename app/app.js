const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');

//database
require('./db/mongoose')

//view engine
app.set('view engine', 'ejs');
app.set('views' , path.join(__dirname, '/../views', ));;

//middleware sesji
app.use(session({
    secret: 'sessionKeySecret',   //dodatkowe zabezpieczenie zapisane w konfigu-losowy klucz
    saveUninitialized: true,  
    cookie:{maxAge:1000*60*60*24*2}, 
    resave: false  
}));

//layouts
//app.use(expressLayouts);


//public
app.use(express.static('public'));

//middleware Parser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.use('/', require('./db/middlewares/user-middleware'));
app.use('/admin', require('./db/middlewares/is-auth-middleware'));
app.use('/admin', require('./db/middlewares/is-auth'));


//routes
app.use(require('./routes/web.js'));

module.exports = app;