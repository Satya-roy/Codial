const User = require('../models/user');

//user profile
module.exports.profile = function(req,res){

    User.findById(req.params.id,function(err,user){
        return res.render('profile',{
            title : 'Codial | Profile',
            profile_user : user
        });
    });
    
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
    return res.redirect('/');
}

//sign out
module.exports.destroySession = function(req,res){
    req.logout();
    return res.redirect('/')
};