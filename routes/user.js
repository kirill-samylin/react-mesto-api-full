const user = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validate = /^((http|https):\/\/)(www\.)?([A-Za-z0-9.-]{1,256})\.[A-Za-z]{2,20}/;
const {
  getUsers, getUser, editProfile, editAvatar, getMyInfo,
} = require('../controllers/users');

user.get('/', getUsers);
/* Сделал для фронта */
user.get('/me', getMyInfo);

user.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().alphanum().length(24),
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
    link: Joi.string().pattern(validate).required(),
  }),
}), editAvatar);

module.exports = user;
