const express = require('express');
const port = 8000;

const app = express();

//use express router, need to tell express using middleware
app.use('/',require('./routes/index.js'));



app.listen(port,(err)=>{
    if(err){
        console.log(`error in running the server: ${err}`);
        return;
    }
    console.log(`server is running a port ${port}`);
});