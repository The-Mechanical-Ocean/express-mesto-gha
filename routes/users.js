const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
  findUserMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', findUserMe);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/),
  }),
}), updateUserAvatar);

module.exports = router;
