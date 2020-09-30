require('dotenv').config();
const express = require('express');
const userLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const user = require('./routes/user');
const cards = require('./routes/cards');
const authRouter = require('./routes/auth');
const { PORT = 3000 } = process.env;
const app = express();
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
app.use(cors({ origin: true }));
const limiter = userLimit({
  windowMs: 1000, // 1 second
  max: 5, // limit each IP to 5 requests per windowMs
});

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then(() => console.log('DB Connected!'))
  .catch((err) => {
    console.log(err);
  });
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/', authRouter);

app.use(auth);

app.use('/users', user);
app.use('/cards', cards);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
