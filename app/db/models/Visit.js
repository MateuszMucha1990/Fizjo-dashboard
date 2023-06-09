const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const visitSchema = new Schema({
    visitSubsc:{
        type:String,
        require
    },
    visitTime:{
        type:String
    },
    visitDate:{
        type: mongoose.Types.ObjectId,
        ref: 'Patient'
    },
});

visitSchema.pre('save',function(next) {
    this.visitTime = moment(this.visitTime).format('YYYY-MM-DD');
   // this.added.visitdate = moment(this.visit).format('YYYY-MM-DD');
         next()
});

const Visit = mongoose.model('Visit', visitSchema );
module.exports= Visit;





