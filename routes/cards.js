const cards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const validate = /^((http|https):\/\/)(www\.)?([A-Za-z0-9.-]{1,256})\.[A-Za-z]{2,20}/;

cards.get('/', getCards);
cards.post('/', createCard);

cards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(validate).required(),
  }),
}), createCard);

cards.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().alphanum().length(24),
  }),
}), deleteCard);

cards.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().alphanum().length(24),
  }),
}), likeCard);

cards.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().alphanum().length(24),
  }),
}), dislikeCard);

module.exports = cards;
