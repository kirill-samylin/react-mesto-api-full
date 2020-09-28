const user = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, editProfile, editAvatar,
} = require('../controllers/users');

user.get('/', getUsers);

user.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUser);

user.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), editProfile);

user.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    link: Joi.string().required(),
  }),
}), editAvatar);

module.exports = user;
