const express = require('express');
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const app = express();
//connect the server to the data base
const db = require('./config/mongoose');
//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
//const MongoStore = require('connect-mongo')(session);

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));

//setting layouts config
app.use(expressLayouts);

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


//set view engine
app.set('view engine','ejs');
app.set('views','./views');


app.use(session({
    name: 'codeial',
    //TODO change the secret before deployment in production
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000*60*100) //100 min
    },//MongoStore is used to store the session cookie in the db
    // store : new MongoStore({
    //     mongooseConnection: db,
    //     autoRemove: 'disabled'
    // },function(err){
    //     console.log(err || 'connect-mongodb setup ok');
    // })
}));

//tell express to use passport
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//use express router, need to tell express using middleware
app.use('/',require('./routes/index'));


app.listen(port,(err)=>{
    if(err){
        console.log(`error in running the server: ${err}`);
        return;
    }
    console.log(`server is running a port ${port}`);
});