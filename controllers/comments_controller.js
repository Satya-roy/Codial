const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');

module.exports.create = async function(req,res){
    //if post exist then create the comment
    try{
        let post = await Post.findById(req.body.post);

        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post:req.body.post,
                user:req.user._id
            });

            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user','name email').execPopulate();
            //commentsMailer.newComment(comment);

            let job = queue.create('emails',comment).save(function(err){
                if(err){
                    console.log(`Error in creating a queue`);
                    return;
                }
                console.log(`job enqueued`,job.id);
            });


            if(req.xhr){
                
                return res.status(200).json({
                    
                    data : {
                        comment : comment
                    },
                    message : "comment created!"
                });
            }

            req.flash('success','Posted Comment!');
            res.redirect('/');
        }
    }
    catch(err){
        req.flash('error',err);
        console.log('Error',err);
        return;
    }
    
};

module.exports.destroy = async function(req,res){
    try{
        let comment = await Comment.findById(req.params.id);

        if(comment && comment.user==req.user.id){ //.id converts it into string

                let postId = comment.post;

                comment.remove();
                // pull helps to pull the comment from the comment array and remove it
                // syntax used in mongodb so mongoose can use aswell
            Post.findByIdAndUpdate(postId,{ $pull :{comments: req.params.id}},function(err,post){

                req.flash('success','Deleted Comment!');

                return res.redirect('back');
            });
        }else{
            
            return res.redirect('back');
        }
    }
    catch(err){
        req.flash('error',err);
        console.log('Error',err);
        return;
    }
}