const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')
const app = express();
const cors = require("cors");
app.use(cors());


// Passport Config
require('./config/passport')(passport);

//DB config

const db = require('./config/keys').MongoURI;

// connect to mongo
mongoose.connect(db, { useNewUrlParser: true }).then(() => console.log('mongoDb Connected')).catch(err => console.error(err));

//BodyParser
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));





//Express Session
// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
//Routes
app.use('/', require('./routes/index'));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server is stared on Port ${PORT}`))