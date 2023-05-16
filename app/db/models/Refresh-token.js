const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RefreshTokenSchema = new Schema ({
    token:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

const RefreshTokenModel = mongoose.model("RefreshTokenModel",RefreshTokenSchema);;
module.exports = RefreshTokenModel;