
// //SIIGN IN
// module.exports.create = function(req,res){
//     return res.render('user_Sign_Up',{
//         title : 'Codial | Sign Up'
//     });
// };
// //user sign in 
// 

// module.exports.signUp = function(req,res){
//     userSignIn.create({
//         email : req.body.email,
//         password: req.body.password,
//         name: req.body.name
//     },function(err,newUser){
//         if(err){
//             console.log(`error in sign-in new user : ${err}`);
//         }
//         console.log(newUser);
//         return res.end(`<h1>Sign in successful ${newUser.name}</h1>`);
//     });
// }
// //---------------------------------------------------------------------------------

// module.exports.create = function(req,res){
//     return res.render('user_Sign_In',{
//         title : 'Codial | Sign In' 
//     });
// }


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
module.exports.createSession = function(){

}