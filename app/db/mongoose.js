const mongoose = require('mongoose');
const {database} = require('../config');

mongoose.connect(database);
mongoose.set('strictQuery', false);

