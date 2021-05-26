//Let implement via classes
//this class would be initialized for every post on the page
// 1. when the page loads
// 2. creation of every post dynamically via ajax

class PostComments{
    //constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);
    }


    createComment(postId){
        let pself = this; //constructor instance
        this.newCommentForm.submit(function(e){
            e.preventDefault();

            let self = this; //comment form

            $.ajax({
                type : 'post',
                url : '/comments/create',
                data : $(self).serialize(), //Jquery data can be converted into JSON form
                success : function(received_data){
                    let newComment = pself.newCommentDom(received_data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    //pself.deleteComment($(' .delete-comment-button', newComment));

                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                    
                },
                error : function(error){
                    console.log(error.responseText);
                }
            });
        });
    }



    newCommentDom(comment){
        return $(`<li id="comment-${comment._id}">
        <p>
            
            <small>
                <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
            </small>
            
            comment - ${comment.content}
            <br>
            <small>
                -> ${comment.user.name}
            </small>
        </p>
    </li>`);
    }

    //delete comment
    // deleteComment(deleteButton){
    //     $(deleteButton).click(function(e){
    //         e.preventDefault();
    //         console.log('$$$');
    //     });
    // }
}