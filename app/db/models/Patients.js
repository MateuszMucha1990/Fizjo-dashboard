const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const mongoosePaginate = require('mongoose-paginate-v2');

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
    // visitDate:{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Visit'
    // },
     connect:{
        type: mongoose.Types.ObjectId,
         ref: 'User'
     },
});

patientSchema.plugin(mongoosePaginate)

patientSchema.pre('save',function(next) {
    //this.visit = moment(this.visit).format('DD-MM-YYYY');
    this.visit = moment(this.visit).format('YYYY-MM-DD');
   // this.added.visitdate = moment(this.visit).format('YYYY-MM-DD');
         next()
});


const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;

  // visitSubsc:{
    //     type:Array,
    //     default:[],
    //     visitdate:{
    //         type:Date
    //     },
    // },