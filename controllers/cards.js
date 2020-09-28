const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(new BadRequestError(err)));
};
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => next(new BadRequestError(err)));
};
module.exports.deleteCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findOneAndDelete({ _id: req.params.id, owner })
    .then((card) => {
      if (!card) throw new NotFoundError('Нет карточки с таким id');
      res.send(card);
    })
    .catch(next);
};
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true })
    .then((card) => {
      if (!card) throw new NotFoundError('Нет карточки с таким id');
      res.send(card);
    })
    .catch(next);
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true, runValidators: true })
    .then((card) => {
      if (!card) throw new NotFoundError('Нет карточки с таким id');
      res.send(card);
    })
    .catch(next);
};
