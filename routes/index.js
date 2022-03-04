const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFound = require('../errors/NotFound');

router.use(usersRouter);
router.use(moviesRouter);
router.use(() => {
  throw new NotFound('Ресурс не найден');
});

module.exports = router;
