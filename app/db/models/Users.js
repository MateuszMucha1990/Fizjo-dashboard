const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema ({
    username:{
        type:String,
        require:[true, 'Login jest wymagany'],
        lowercase:true,
        trim:true,
       // unique:[true,'Ten Login jest już zajęty'],
    },
    email:{
        type:String,
        require:[true, 'Email jest wymagany'],
        lowercase:true,
        trim:true,
    },

    password:{
        type:String,
        require:[true, 'Hasło jest wymagane'],
    },
   

});

const User = mongoose.model('User', userSchema);

module.exports = User;