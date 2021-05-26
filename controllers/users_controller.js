const User = require('../models/user');
const fs = require('fs'); //file system to delete image
const path = require('path');

//user profile
module.exports.profile = function(req,res){

    User.findById(req.params.id,function(err,user){
        return res.render('user_profile',{
            title : 'Codial | Profile',
            profile_user : user
        });
    });
    
}
//update profile
module.exports.update = async function(req,res){
    if(req.user.id == req.params.id){
        try{
            let user = await User.findByIdAndUpdate(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log(`*****Multer Error: `,err);
                }
                // the req is multipart cannot read req.body without multer
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){

                    // if img already exist delete first then update
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar)); //to delete from the folder
                    }

                    //this is saving the path of uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }
        catch(err){
            req.flash('error',err);
            return res.redirect('back');
        }
    }
    else{
        req.flash('error','Unauthorized');
        return res.status(401).send('Unauthorized'); 
    }
}

// render sign up page
module.exports.signUp = function(req,res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up',{
        title : 'Codial | Sign Up'
    });
};
//render sign in page
module.exports.signIn = function(req,res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in',{
        title : 'Codial | Sign In'
    });
};



//create new user
module.exports.create = function(req,res){
    
    User.findOne({email : req.body.email},(err,user)=>{
        if(err){
            console.log(`error in creating user in signing up`);
            return;
        }

        if(!user){
            User.create({
                email: req.body.email,
                password: req.body.password,
                name : req.body.name
            }, function(err,user){
                if(err){
                    console.log('error in creating user while sigining up');
                    return;
                }
                return res.redirect('/users/sign-in');
            });
        }
        else{
            res.redirect('back');
        }
    });

}
//sign in and a create session for the user
module.exports.createSession = function(req,res){
    req.flash('success','Logged in Successfully');
    return res.redirect('/');
}

//sign out
module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success','You have logged out');
    
    return res.redirect('/')
};