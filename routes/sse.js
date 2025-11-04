const express = require('express');
const router = express.Router();
const {connectSse} = require("../controllers/sse");

router.get('/api/sse/appointments/:id', connectSse)

module.exports = router