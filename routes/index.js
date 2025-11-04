var express = require('express');
var router = express.Router();

const TransactionRouter = require('./transaction');
const AuthRouter = require('./auth');
const CheckoutRouter = require('./checkout');
const StripeWebhookRouter = require('./stripe-webhook');
const SseRouter = require('./sse');

router.use('/', TransactionRouter);
router.use('/', AuthRouter);
router.use('/', CheckoutRouter);
router.use('/', StripeWebhookRouter);
router.use('/', SseRouter);

module.exports = router;
