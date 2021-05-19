const express = require('express');
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const app = express();
//connect the server to the data base
const db = require('./config/mongoose');


app.use(express.static('./assets'));

//setting layouts config
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//use express router, need to tell express using middleware
app.use('/',require('./routes/index'));


//set view engine
app.set('view engine','ejs');
app.set('views','./views');


app.listen(port,(err)=>{
    if(err){
        console.log(`error in running the server: ${err}`);
        return;
    }
    console.log(`server is running a port ${port}`);
});