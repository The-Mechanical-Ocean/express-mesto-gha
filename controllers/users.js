const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Server error' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((users) => {
      if (!users) {
        res.status(404).send({ message: 'User is not found' });
        return;
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'id is incorrect' });
        return;
      }
      res.status(500).send({ message: 'Server error' });
    });
};

module.exports.createUsers = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Data is incorrect' });
        return;
      }
      res.status(500).send({ message: 'Server error' });
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
        res.status(404).send({ message: 'User is not found' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Data is incorrect' });
        return;
      }
      res.status(500).send({ message: 'Server error' });
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
        res.status(404).send({ message: 'User is not found' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Data is incorrect' });
        return;
      }
      res.status(500).send({ message: 'Server error' });
    });
};