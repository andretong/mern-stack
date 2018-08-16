/*User Authentication*/
const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys.js');
const passport = require('passport');

//Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User Model
const User = require ('../../models/User');

// @route   GET api/users/test
// @desc    Test Users route
// @access  Public
router.get('/test', (req, res) => res.json( { msg: "users works" }));

// @route   GET api/users/register
// @desc    Register a User
// @access  Public
router.post('/register', (req, res) => {

  //Check validation
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid){
      return res.status(400).json(errors);
  }

  User.findOne({email : req.body.email})
  .then(user => {
    if (user){
      errors.email = 'Email already exists.'
      return res.status(400).json(errors);
    }else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', //Size
        r: 'pg', //Rating
        d: 'mm' //Default
      });

       const newUser = new User({
         name : req.body.name,
         email : req.body.email,
         avatar,
          password : req.body.password,
       });


         bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
                // Store hash in your password DB.
                if (err) throw err;

                newUser.password = hash;
                newUser.save()
                  .then(user => res.json(user))
                  .catch(err => console.log(err));
            });
        });
    }
  });

});


// @route   GET api/users/login
// @desc    Login a User --> Returning a JWT Token
// @access  Public
router.post('/login', (req, res) => {

  //Check validation
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid){
      return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find the user by Email
  User.findOne({ email })
  .then(user => {
    if (!user){
      errors.email = 'User Email not found'
      return res.status(404).json(errors)
    }

    //Check Password
    bcrypt.compare(password, user.password)
    .then(isMatch => {
      if (isMatch){
        //res.json({msg : 'Success'});
        //User Match

        // JWT Payload
        const payload = {
          id : user.id,
          name : user.name,
          avatar : user.avatar
        };

        //Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn : 3600 },
          (err, token) => {
            res.json({
              success : true,
              token : 'Bearer '+ token
            });
          }
        );


      }else{
        //USer Does not match
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });

  });

});


// @route   GET api/users/current
// @desc    Return a Current User
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
        id : req.user.id,
        name : req.user.name,
        email : req.user.email,
    });
  });

module.exports = router;
