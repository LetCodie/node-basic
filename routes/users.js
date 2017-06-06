const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

let User = require('../models/user');

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password_confirm = req.body.password_confirm;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password_confirm', 'Password is not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors) {
    res.render('register', {
      errors: errors
    });

  } else {
    let user = new User();
    user.name = name;
    user.email = email;
    user.username = username;
    user.password = password;

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(error, hash) {
        if(error) {
          console.log(error);
        } else {
          user.password = hash;
          user.save(function(e) {
            if(e) {
              console.log(e);
            } else {
              req.flash('success', 'You are not register, please login');

              res.redirect('/users/login');
            }
          });
        }
      });
    });
  }
});


router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You are logout.');
  res.redirect('/users/login');
});

module.exports = router;
