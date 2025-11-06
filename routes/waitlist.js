const express = require('express');
const {createWaitlist} = require("../controllers/waitlist");
const passport = require("passport");
const router = express.Router();

const requireAuth = passport.authenticate('jwt', {session: false});


router.post('/api/createWaitlist', requireAuth, createWaitlist)


module.exports = router;