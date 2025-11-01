var express = require('express');
var router = express.Router();
require('../services/passport')
const passport = require('passport');
const users = require('../controllers/auth');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});

router.post('/api/signup', users.signup);
router.post('/api/signin', requireSignin, users.signin);

router.get('/auth/google', users.googleAuth);
router.get('/auth/google/callback', users.googleAuthCallback);

router.get('/api/getUser', requireAuth, users.getUserProfile);

router.get('/api/getUserByEmail', users.findByEmail)

module.exports = router;
