const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req,res){
    //if post exist then create the comment
    Post.findById(req.body.post, function(err,post){
        console.log(`post controller`);
        if(post){
            Comment.create({
                content: req.body.content,
                post:req.body.post,
                user:req.user._id
            }, function(err,comment){
                //handle error
                post.comments.push(comment);
                post.save();

                res.redirect('/');
            });
        }
    });
};

module.exports.destroy = function(req,res){
    Comment.findById(req.params.id,function(err,comment){
        if(comment && comment.user==req.user.id){ //.id converts it into string

            let postId = comment.post;

            comment.remove();
            // pull helps to pull the comment from the comment array and remove it
            // syntax used in mongodb so mongoose can use aswell
            Post.findByIdAndUpdate(postId,{ $pull :{comments: req.params.id}},function(err,post){
                return redirect('back');
            });
        }else{
            return res.redirect('back');
        }
    });
}