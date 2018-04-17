'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt     = require("bcrypt");
const saltRounds = 10;

router.get('/login', (req, res, next)=> {
  res.render('../views/login.hbs');
});

router.post('/login', (req, res, next)=> {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username: username})
  .then(user => {
    if (!user) {
      res.redirect('/auth/login');
    }
    else if(bcrypt.compareSync(password, user.password)){
      req.session.user = user;
      res.redirect('/');
    }
    else{
     res.redirect('/auth/signup');
    }
  })
  .catch(next)
  });
  //res.redirect('/auth/login');


router.get('/signup', (req, res, next)=> {
  res.render('../views/signup.hbs');
});

router.post('/signup', (req, res, next)=> {
  const username = req.body.username;
  const password = req.body.password;
  const salt  = bcrypt.genSaltSync(saltRounds);
  const hashPass = bcrypt.hashSync(password, salt);

  User.findOne({username: username})
    .then(user => {
      if (!user) {
        return res.redirect('/auth/signup');
      } else if (user === username) {
        return res.redirect('/auth/login');
      } else {
        const user = new User({
          username,
          password: hashPass });
        user.save()
          .then(() => {
            res.redirect(`/starter-page`);
          });
      }
    })
    .catch(next);
  });
//   const user = new User({
//     username,
//     password: hashPass
//   });

//   user.save()
//   .then(() => {
//     res.redirect('/');

//   })
//   .catch(err => {next(err);
//   });



module.exports = router;