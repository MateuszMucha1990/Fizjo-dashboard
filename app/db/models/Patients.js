const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema ({
    name:{
        type:String,
        require
    },
   
    email:{
        type:String,
        lowercase:true,
        trim:true,
    },
    pesel:{
        type:Number,
        require,
    },
    phone:{
        type: Number,
        require
    },
    address:{
        type:String
    },
    note:{
        type:String,
    },
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;