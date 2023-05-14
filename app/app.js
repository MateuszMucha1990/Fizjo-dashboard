const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');


//database
require('./db/mongoose')

//view engine
app.set('view engine', 'ejs');
app.set('views' , path.join(__dirname + '/../views'));;


//layouts
//app.use(expressLayouts);

app.use(express.static('public'));
app.use(require('./routes/web.js'));

module.exports = app;