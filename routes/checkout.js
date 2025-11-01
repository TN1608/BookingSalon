const express = require('express');
const {checkoutSession, syncItems, verifySession} = require("../controllers/checkout");
const passport = require("passport");
const router = express.Router();

const requireAuth = passport.authenticate('jwt', {session: false});

router.post('/api/checkout',requireAuth, checkoutSession)
router.post('/api/sync-items', syncItems)

module.exports = router;