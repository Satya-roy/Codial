const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//create authentication function tell passport to use the above strategy
const User = require('../models/user');


//1. authencticate using passport
passport.use(new LocalStrategy({
        usernameField : 'email'
    },
    function(email,password,done){
        //find the user and establish the identity
        User.findOne({email : email},function(err,user){

            //if there is an error in finding the user
            if(err){
                console.log(`error in finding user --> Passport`);
                return done(err);
            }

            //if user not found  or the password is incorrect
            if(!user || user.password!= password){
                console.log(`invalid username/password`);
                return done(null,false);
            }
            //user found
            return done(null,user);
        })
    }
));

//2. serializing the user to decide which key(user.id) is to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
});

//3. deserializing the user from the key(user.id) in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log(`Error in finding the user ---> deserialize user authenctication`);
        }

        return done(null,user);
    });
});


//check if the user is authenticated,create middleware for it
passport.checkAuthentication = function(req,res,next){
    //if the user is signed in,then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    //if user is not signed in
    return res.redirect('/users/sign-in');
}
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session-cookie 
        //and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;