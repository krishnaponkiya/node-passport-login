const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
const User = require('../models/User');
const { route } = require(".");

// Register
router.post('/register', (req, res) => {
  const { name, password, password2 } = req.body;
  let errors = [];

  if (!name || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }
      if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      password,
      password2
    });
  } else {
    User.findOne({ name: name }).then(user => {
      if (user) {
        errors.push({ msg: 'Name already exists' });
        res.render('register', {errors,name,password,password2});
      } else {
        const newUser = new User({name,password});
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                res.send("You are now registered ");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


//Login 
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/failed',
    failureFlash: true
  })(req, res, next);
});

router.get("/dashboard", (req, res) => {
  res.send({ message: "You Have Successfully Logged In", code : 200});
});

router.get("/failed", (req, res) => {
  res.status(500).json({ error: "Username or Password Incorrect" });
});

module.exports = router;
