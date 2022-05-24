const express = require('express');
const mongoose = require('mongoose');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1/mestodb');

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '62827c67f5f0bf762496ac4a',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Sorry, page not found' });
});

app.listen(PORT);
