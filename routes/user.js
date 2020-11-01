const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const requireLogin = require('../middleware/requireLogin');

router.get('/profile/:id', requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .populate('following')
    .populate('followers')
    .select('-password')
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate('postedBy', '_id name')
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(422).json({ message: 'User not founded' });
    });
});

router.put('/updateprofile', requireLogin, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: { pic: req.body.pic },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      res.json(result);
    },
  );
});

router.put('/follow', requireLogin, (req, res) => {
  console.log('hi');
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true },
      )
        .select('-password')
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    },
  );
});

router.put('/unfollow', requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true },
      )
        .select('-password')
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    },
  );
});

router.post('/search-users', (req, res) => {
  let userPattern = new RegExp('^' + req.body.query);
  User.find({ email: { $regex: userPattern } })
    .select('_id email')
    .then((user) => {
      res.json({ user });
    })
    .catch((err) => {
      res.status(422).json({ error: err });
    });
});

router.get('/following-user', requireLogin, (req, res) => {
  User.findOne({ _id: req.user._id })
    .populate('following')
    .populate('followers')
    .select('-password')
    .then((user) => {
      res.json(user);
    })
    .catch((err) => console.log(err));
});

router.post('/otheruser', (req, res) => {
  User.findOne({ _id: req.body.id })
    .populate('following')
    .populate('followers')
    .select('-password')
    .then((user) => {
      res.json(user);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
