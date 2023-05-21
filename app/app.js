const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');

//database
require('./db/mongoose')

//view engine
app.set('view engine', 'ejs');
app.set('views' , path.join(__dirname + '/../views'));;


//layouts
//app.use(expressLayouts);


//public
app.use(express.static('public'));

//middleware Parser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));


//routes
app.use(require('./routes/web.js'));

module.exports = app;