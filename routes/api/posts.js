/*User Authentication*/
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');


const Post = require('../../models/Post');
const Profile = require('../../models/Profile');


const validatePostInput = require('../../validation/post');

// @route   GET api/posts/test
// @desc    Test Post route
// @access  Public
router.get('/test', (req, res) => res.json( { msg: "posts works" }));

// @route   POST api/posts/
// @desc    Create a Post route
// @access  Private
router.post('/', passport.authenticate('jwt', {session : false}) , (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  //check Validations
  if (!isValid){
    return res.status(400).json(errors);
  }


  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user : req.user.id
  });

  newPost.save().then(post => res.json(post));

});


// @route   GET api/posts/
// @desc    Fetch all Post route
// @access  Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date : -1})
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound : "no posts found"}))
});

// @route   GET api/posts/:id
// @desc    Fetch a Post route
// @access  Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostfound : "no post found with that id"}))
});

// @route   DELETE api/posts/:id
// @desc    Delete Post route
// @access  Private
router.delete('/:id', passport.authenticate('jwt', {session : false}), (req, res) => {
  Profile.findOne( { user : req.user.id })
    .then(profile => {
        Post.findById(req.params.id)
          .then(post => {
            //Check for Post Owner
            if (post.user.toString() !== req.user.id){
              return res.status(401).json( {noauthorize : 'User not authorize'});
            }else{
              //Delete a POST
              post.remove()
                .then(() => res.json({ success : true }));
            }

          })
          .catch(err => res.status(404).json({ message : 'post not found'}))
    })
    .catch(err => res.status(404).json({ nopostfound : "no post found with that id"}))
});


// @route   POST api/posts/like/:id
// @desc    POST Like a Post route
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', {session : false}), (req, res) => {
  Profile.findOne( { user : req.user.id })
    .then(profile => {
        Post.findById(req.params.id)
          .then(post => {
            if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
              return res.status(400).json({ alreadyliked : 'User already Like this post'});
            }

            // Add user id to Like Array
            post.likes.unshift({ user : req.user.id });

            post.save().then(post => res.json(post));
          })
          .catch(err => res.status(404).json({ message : 'post not found'}))
    })
    .catch(err => res.status(404).json({ nopostfound : "no post found with that id"}))
});

// @route   POST api/posts/unlike/:id
// @desc    POST UnLike a Post route
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', {session : false}), (req, res) => {
  Profile.findOne( { user : req.user.id })
    .then(profile => {
        Post.findById(req.params.id)
          .then(post => {
            if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
              return res.status(400).json({ notliked : 'You havent Liked this post yet'});
            }

            // Remove a Like from Array
            const removeIndex = post.likes
                    .map(item => item.user.toString())
                    .indexOf(req.user.id);

            //SPlice out of Array
            post.likes.splice(removeIndex, 1);

            post.save().then(post => res.json(post));
          })
          .catch(err => res.status(404).json({ message : 'post not found'}))
    })
    .catch(err => res.status(404).json({ nopostfound : "no post found with that id"}))
});

module.exports = router;
