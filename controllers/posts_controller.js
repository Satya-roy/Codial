const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req,res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user : req.user._id
        });

        //the req is an AJAX req - it is in the form of xhr
        if(req.xhr){
            
            // if we want to populate just the name of the user (we'll not want to send the password in the API)
            post = await post.populate('user','name').execPopulate();

            return res.status(200).json({ //we retrun json with a status
                data:{
                    post:post
                },
                message: "Post Created"
            });
        }

        req.flash('success','Post Published');
        return res.redirect('back');
    }
    catch(err){
        req.flash('error',err);
        return;
    }
}

module.exports.destroy = async function(req,res){

    try{
        let post = await Post.findById(req.params.id);

        //check if the user who is deleting the post is correct user
            //.id converts ._id into string
        if(post.user == req.user.id){
            post.remove();
            await Comment.deleteMany({post:req.params.id});

            if(req.xhr){
                
                return res.status(200).json({
                    data:{
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }


            req.flash('success','Post and associated comments deleted');
            
            return res.redirect('back');
        }else{

            req.flash('error',err);
            
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error',err);
        return;
    }
}