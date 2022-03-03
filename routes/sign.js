const router = require('express').Router();
const {
  login,
  createUser,
} = require('../controllers/users');
const { validationLogin, validationCreateUser } = require('../middlewares/validation');

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);

module.exports = router;
