var express = require('express');
var router = express.Router();
const {getAllTransactions, updateTransactionStatus, syncTransactions, getTransactionsBySessionId} = require("../controllers/transaction");

router.get('/api/getTransactions', getAllTransactions)
router.post('/api/updateStatus/:transactionId', updateTransactionStatus)
router.get('/api/syncTransactions', syncTransactions)
router.get('/api/getTransactionsBySessionId/:sessionId', getTransactionsBySessionId)

module.exports = router;