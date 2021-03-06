const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const RepeatEmailError = require('../errors/RepeatEmailError');
const { NODE_ENV, JWT_SECRET } = process.env;
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(new BadRequestError(err)));
};
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) throw new NotFoundError('Нет пользователя с таким id');
      res.send(user);
    })
    .catch(next);
};
module.exports.getMyInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) throw new NotFoundError('Нет пользователя с таким id');
      res.send(user);
    })
    .catch(next);
};
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      avatar,
      about,
    }))
    .then((data) => res.status(201).send({
      _id: data._id,
      email: data.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new RepeatEmailError(err));
      } else {
        next(new BadRequestError(err));
      }
    });
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new UnauthorizedError('Неправильные почта или пароль');
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) throw new UnauthorizedError('Неправильные почта или пароль');
          return user;
        });
    })
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch(next);
};
module.exports.editProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) throw new NotFoundError('Нет пользователя с таким id');
      res.send(user);
    })
    .catch(next);
};
module.exports.editAvatar = (req, res, next) => {
  const { link } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar: link }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) throw new NotFoundError('Нет пользователя с таким id');
      res.send(user);
    })
    .catch(next);
};
