/*User Authentication*/
const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys.js');


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
  User.findOne({email : req.body.email})
  .then(user => {
    if (user){
      return res.status(400).json({ email: 'Email already exists.' });
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
  const email = req.body.email;
  const password = req.body.password;

  //Find the user by Email
  User.findOne({ email })
  .then(user => {
    if (!user){
      return res.status(404).json({email : 'User Email not found'})
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
        return res.status(400).json({password : 'Password incorrect'});
      }
    });

  });

});


module.exports = router;