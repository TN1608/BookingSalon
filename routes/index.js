var express = require('express');
var router = express.Router();

const TransactionRouter = require('./transaction');
const AuthRouter = require('./auth');
const CheckoutRouter = require('./checkout');

router.use('/', TransactionRouter);
router.use('/', AuthRouter);
router.use('/', CheckoutRouter);

module.exports = router;
