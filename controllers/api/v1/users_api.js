const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession = async function(req,res){
   try{
        let user = await User.findOne({email: req.body.email});

        if(!user || user.password != req.body.password){
            return res.json(422,{
                message : 'invalid username or password'
            });
        }

        return res.json(200,{
            message : `sign in succesfully, here is your tokn please keep it safe!`,
            data:{
                token: jwt.sign(user.toJSON(),'codeial',{expiresIn: '10000'}) //generating the token
            }
        });
   }catch(err){
       console.log('**********',err);
        return res.json(500,{
            message: "Internal Server Error"
        });
   }
}
