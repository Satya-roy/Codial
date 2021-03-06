const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

const crypto = require('crypto');
const User = require('../models/user');

//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: "982284828842-v51dlafipe27luocq9h12ngkkpb2aqi2.apps.googleusercontent.com",
    clientSecret: "7G-U8nnpL4aXHhm51TX5oxqb",
    callbackURL : "http://localhost:2000/users/auth/google/callback"
    },
    function(accessToken,refreshToken,profile,done){
        //find a user
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            if(err){console.log(`error in google strategy-passport`,err); return;}
            //console.log(profile);

            if(user){
                //if found set this user as req.user
                return done(null,user);
            }else{
                // if not found, create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                },function(err,user){
                    if(err){console.log(`Error in creating user`,user); return;}

                    return done(null,user);
                });
            }
        });
    }
));

module.exports = passport;
