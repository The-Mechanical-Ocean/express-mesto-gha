const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((users) => {
      if (!users) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'идентификатор неверен' });
        return;
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports.findUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createUsers = (req, res) => {
  const { name, about, avatar, email } = req.body;
  User.create({ name, about, avatar, email, password: hash })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введенные данные некорректны' });
        return;
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введенные данные некорректны' });
        return;
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введенные данные некорректны' });
        return;
      }
      res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 604800000,
        httpOnly: true,
      }).send({ data: token });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        next(new UnauthorizedError('Email or password are incorrect'));
      }
      next(err);
    });
};
