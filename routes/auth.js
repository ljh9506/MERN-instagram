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
      'data:image/jpeg;base64,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';
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
  User.findOne({ email: email }).then((savedUser) => {
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
