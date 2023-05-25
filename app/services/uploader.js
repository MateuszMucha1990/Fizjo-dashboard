const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,'public/uploads/');
    },
    filename: function(req,file, cb) {
        const name = Date.now() + path.extname(file.originalname);
        cb(null,name)
    },

limits: {
    fileSize:10000000
},
fileFilter: function(req,file,cb){
    if(file.size==0){
        return cb(new Error('File is empty'));
    }
    cb(null,true)
}})
const upload = multer({storage});
module.exports = upload;
