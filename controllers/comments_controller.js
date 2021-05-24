const Comment = require('../models/comment');
const Post = require('../models/post');

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
            req.flash('error',err);
            return res.redirect('back');
        }
    }
    catch(err){
        console.log('Error',err);
        return;
    }
}