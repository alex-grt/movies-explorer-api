require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const signRouter = require('./routes/sign');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const corsHandler = require('./middlewares/cors-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, DB_ADDRESS = 'mongodb://localhost:27017/devdb' } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(requestLogger);
app.use(corsHandler);
app.use(signRouter);
app.use(auth);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`Слушаем порт ${PORT}`);
});
