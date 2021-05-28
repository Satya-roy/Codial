const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

//this is the part that sends the email
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gamil.com',
    port : 587,                //TLS security
    secure:false,
    auth:{
        user: '',
        pass: ''
    }
});

let renderTemplate = (data,relativePaht)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err, template){
            if(err){
                console.log(`Error in rendering template`);
                return;            
            }

            mailHTML = template;
        }
    );

    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}