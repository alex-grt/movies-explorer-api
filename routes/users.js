const router = require('express').Router();
const {
  getUser,
  updateProfile,
} = require('../controllers/users');
const { validationUpdateProfile } = require('../middlewares/validation');

router.get('/me', getUser);
router.patch('/me', validationUpdateProfile, updateProfile);

module.exports = router;
