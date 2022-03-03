const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');

function getMovies(req, res, next) {
  return Movie
    .find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
}

function createMovie(req, res, next) {
  const {
    movieId,
    nameRU,
    nameEN,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
  } = req.body;
  const owner = req.user._id;

  return Movie
    .create({
      movieId,
      nameRU,
      nameEN,
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner,
    })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
}

function deleteMovie(req, res, next) {
  const { id } = req.params;

  return Movie
    .findById(id)
    .orFail(() => new NotFound('Ресурс не найден'))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        return movie.remove()
          .then(() => res.status(200).send(movie));
      }

      return next(new Forbidden('Доступ запрещён'));
    })
    .catch(next);
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
