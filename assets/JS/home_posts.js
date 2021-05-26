{
    //this function send the data
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            
            
            $.ajax({
                type : 'post',
                url : '/posts/create',
                data : newPostForm.serialize(), //convert it in json form {data : {content : _______ }}
                success : function(received_data){
                     //recieved_data :{data:{ post: {comments: ______, _id: _______, user_id:_______}}} JSON format

                     let newPost = newPostDom(received_data.data.post);
                     $('#posts-list-container>ul').prepend(newPost); //newPost is a xml response
                    
                     //Find all div elements within an XML document from an Ajax response.
                     deletePost($(' .delete-post-button',newPost));

                     //call createComment class
                     new PostComments(received_data.data.post._id); 

                     new Noty({
                        theme: 'relax',
                        text: "Post Published",
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

    //method to create the post in the dom
    let newPostDom = function(post){
        return $(`
            <li id="post-${post._id}">
            <p>

                
                <small>
                    <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
                </small>
                
                ${post.content}- 
                <small>
                    ${post.user.name}
                </small>
            </p>
            
            <!-- comment form -->
            <div class="post-comments">
                
                <form id="post-${post._id}-comments-form" action="/comments/create" method="POST">
                    <input type="text" name="content" placeholder="Type Here to add comment..." required>
                    <input type="hidden" name="post" value="<%=post._id%>">
                    <input type="submit" value="Add Comment">
                </form>
               
            </div>

            <div class="post-comments-list">
                
                <ul id="post-comments-${post._id}">
                
                </ul>
            </div>
        </li>
    `);
    }

    //method to delete a post from the DOM
    let deletePost = function(deleteButton){      //deleteButton is <a></a> or delete button
        $(deleteButton).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url :$(deleteButton).prop('href'),
                success: function(recieved_data){
                    
                    $(`#post-${recieved_data.data.post_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted------",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                },
                error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }



    let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this); //self is Jquery object of the list
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            let postId = self.prop('id').split('-')[1];
            new PostComments(postId);
            
        });
    }
    createPost();
    convertPostsToAjax();
    
}