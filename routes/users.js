const router = require('express').Router();
const {
  getUser,
  updateProfile,
} = require('../controllers/users');
const { validationUpdateProfile } = require('../middlewares/validation');

router.get('/users/me', getUser);
router.patch('/users/me', validationUpdateProfile, updateProfile);

module.exports = router;
