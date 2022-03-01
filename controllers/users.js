const bcrypt = require('bcryptjs/dist/bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const Unauthorized = require('../errors/Unauthorized');
const NotFound = require('../errors/NotFound');
const Conflict = require('../errors/Conflict');

const { JWT_SECRET = 'oops' } = process.env;

function getUser(req, res, next) {
  const owner = req.user._id;

  return User
    .findById(owner)
    .orFail(() => new NotFound('Ресурс не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      }

      next(err);
    });
}

function createUser(req, res, next) {
  const {
    email,
    password,
    name,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new Conflict('Пользователь с таким email существует'));
      }

      next(err);
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  return User
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
      }

      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
          }

          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.status(202).send({ token });
    })
    .catch(next);
}

function updateProfile(req, res, next) {
  const { name, email } = req.body;
  const owner = req.user._id;

  return User
    .findByIdAndUpdate(
      owner,
      { name, email },
      { new: true, runValidators: true },
    ).orFail(() => new NotFound('Ресурс не найден'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new Conflict('Пользователь с таким email существует'));
      }

      next(err);
    });
}

module.exports = {
  getUser,
  createUser,
  login,
  updateProfile,
};
