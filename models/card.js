const mongoose = require('mongoose');
const validator = require('validator');
const validatorOptions = {
  protocols: ['http', 'https'],
  require_protocol: true,
  require_valid_protocol: true,
};
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    validate: {
      validator(link) {
        return validator.isURL(link, validatorOptions);
      },
      message: 'Введите ссылку!',
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });
module.exports = mongoose.model('card', cardSchema);
