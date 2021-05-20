module.exports.profile = function(req,res){
    if(req.cookies.user_id){
        User.findById(req.cookies.user_id,function(err,user){
            if(user){
                return res.end(`<h1>Cookie of ${user.name} is present</h1>`);
            }

            return res.redirect('/users/sign-in');
        });
    }else{
        return res.redirect('users/sign-in');
    }
}

// render sign up page
module.exports.signUp = function(req,res){
    return res.render('user_sign_up',{
        title : 'Codial | Sign Up'
    });
};
//render sign in page
module.exports.signIn = function(req,res){
    return res.render('user_sign_in',{
        title : 'Codial | Sign In'
    });
};

const User = require('../models/user');

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
//create session
module.exports.createSession = function(req,res){
    //find the user
    User.findOne({email : req.body.email},function(err,user){
        if(err){console.log(`error in finding user in signing in`); return}
        // handle user found
        if(user){
            //handle password which doesn't match
            if(user.password != req.body.password){
                res.redirect('back');
            }
            //handle session creation
            res.cookie('user_id',user.id);
            return res.end(`<h1>Profile of ${user.name} with email ${user.email}</h1>`);
        }
        else{
            // handle user not found
            res.redirect('back');
        }
    });
}