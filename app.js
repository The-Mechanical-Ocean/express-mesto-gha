const express = require('express');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const { errors, Joi, celebrate } = require('celebrate');
const { createUsers, login } = require('./controllers/users');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1/mestodb');

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(http(s)?:\/\/)(?:www\.|(?!www))+[\w\-._~:/?#[\]@!$&'()*+,;=]+#?$/),
  }),
}), createUsers);

app.use((req, res, next) => {
  next();
});

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT);
