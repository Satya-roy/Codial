const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars'); //folder wherer multer will save the data

const userSchema = new mongoose.Schema({
    email:{
        type : String,
        required : true,
        unique : true
    },
    password:{
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    avatar:{             // stores the path of the file
        type: String
    }
},{
    timestamps : true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) { //req ; request, file: file from the request, cb : call back function
      cb(null, path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
  });


//static functions -- they are publicly accesseble methods
userSchema.statics.uploadedAvatar = multer({storage: storage}).single(`avatar`);
//to access path
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User',userSchema);

module.exports = User;