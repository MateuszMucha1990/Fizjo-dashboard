const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

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
    visit:{
        type:String,
    },
    added:{
        type:Date,
        default: Date.now()
    },
});

patientSchema.pre('save',function(next) {
    this.visit = moment(this.visit).format('DD-MM-YYYY');
         next()
});


const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;