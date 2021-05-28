const queue = require('../config/kue');
const commentsMailer = require('../mailers/comments_mailer');

//every queue has a process JOB are given to these pocesses

//emails is the name of the queue
queue.process('emails',function(job,done){
    //console.log(`emails worker is processing a job`,job.data);
    commentsMailer.newComment(job.data);
    done();
});