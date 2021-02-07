const express = require('express');
const router = express.Router();
const User = require('../models/user');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const requireLogin = require('../middleware/requireLogin');
const { JWT_SECRET } = require('../config/keys');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

//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

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key:
        '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',
    },
  }),
);

router.post('/signup', (req, res) => {
  console.log(req.body);
  let { name, email, password, pic } = req.body;
  if (!pic) {
    pic =
      'https://lh3.googleusercontent.com/proxy/ojTWXi2Z9v0YBWfv2-lrBpS7sohvJcfGxm9bL2kfXi0puYoA3eDvjCZFUpYNlcT_PI6N2Frxy3LqMo9bMcpuuyrLbFSteM_OXcqZTFBRvg';
  }
  if (!email || !name || !password) {
    return res.status(422).json({ error: 'please add all the fields' });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: 'User is already exists' });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          email,
          password: hashedpassword,
          name,
          pic,
        });

        user
          .save()
          .then((user) => {
            transporter
              .sendMail({
                to: user.email,
                from: 'leejh95@nate.com',
                subject: 'signup success',
                html: `<h1>${user.name}님 가입을 환영합니다 !!</h1>`,
              })
              .then((res) => {
                console.log(res);
              })
              .catch((err) => console.log(err));
            res.json({ message: 'User successfully saved' });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: 'please write email or password' });
  }
  User.findOne({ email: email })
    .populate('following')
    .populate('followers')
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: 'Invalid email or password' });
      }
      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            // res.json({message:'successfully logged in'})
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            const { _id, name, email, followers, following, pic } = savedUser;
            res.json({
              token,
              user: { _id, name, email, followers, following, pic },
            });
          } else {
            return res.status(422).json({ error: 'Invalid email or password' });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
});

router.post('/reset-password', (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: 'User not exists with that email' });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: 'leejh95@nate.com',
          subject: 'password reset',
          html: `
          <p>You requested for password reset</p>
          <h5>Click in this <a href="http://localhost:3000/reset/${token}">link</a>  link to reset password</h5>
          `,
        });
        res.json({ message: 'check your email' });
      });
    });
  });
});

router.post('/new-password', (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: 'Try Again session expired' });
      }
      bcrypt.hash(newPassword, 12).then((hashedpassword) => {
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((saveduser) => {
          res.json({ message: 'password updated successfully' });
        });
      });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
