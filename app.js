require('dotenv').config(); // require dotenv MUST be at top
const express = require('express');
const morgan = require('morgan');
const path = require('path');
// const path = require('node.path');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes/index');
const app = express();
// const PORT = 3000;
// convert the port to store it within the ENV
const PORT = process.env.PORT || 3000



app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));

// create the container for express to use sessions to store the user state
app.use(session({
    secret: process.env.SECRET_KEY, // note that secrets are mandatory
    resave: false, // Resave explanation
    // Forces the session to be saved back to the session store, even if the session was never modified during the request. Depending on your store thismay be necessary, but it can also create race conditions where a client makes two parallel requests to your server and changes made to the session in one request may get overwritten when the other request ends, even if it made no changes
    saveUninitialized: false 
}))

// initialize passport
app.use(passport.initialize());
// passport to use session
app.use(passport.session());

app.use(routes); 

require('./config/connection');

app.listen(PORT, () => {
    console.log(`The server is listening on port ${PORT}`);
    // console.log(`You can put your MongoDB link here when the server restarts to jump to our database`);
    // console.log(`MongoDB: [database url]`)
});


