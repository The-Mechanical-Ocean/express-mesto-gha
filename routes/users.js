const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
  findUserMe,
} = require('../controllers/users');

const { Joi, celebrate } = require('celebrate');

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
    avatar: Joi.string().regex(/^(http(s)?:\/\/)(?:www\.|(?!www))+[\w\-._~:/?#[\]@!$&'()*+,;=]+#?$/),
  }),
}), updateUserAvatar);

module.exports = router;
