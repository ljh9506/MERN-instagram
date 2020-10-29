const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 5000;

require('./models/user');
require('./models/post');

app.use(cors());
app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

mongoose.connect(
  'mongodb://localhost/react-instagram',
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    if (err) {
      console.log('its fucking error');
    } else {
      console.log('mongoose connected !!');
    }
  },
);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log('server is running on', PORT);
});
