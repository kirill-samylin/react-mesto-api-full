const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const error = new UnauthorizedError('Необходима авторизация');
  if (!authorization || !authorization.startsWith('Bearer ')) next(error);

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(error);
  }
  req.user = payload;

  next();
};
