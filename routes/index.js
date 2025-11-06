var express = require('express');
var router = express.Router();

const TransactionRouter = require('./transaction');
const AuthRouter = require('./auth');
const CheckoutRouter = require('./checkout');
const SseRouter = require('./sse');

router.use('/', TransactionRouter);
router.use('/', AuthRouter);
router.use('/', CheckoutRouter);
router.use('/', SseRouter);

module.exports = router;
