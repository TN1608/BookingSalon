const {
    doc,
    setDoc,
    getDocs,
    getDoc,
    writeBatch,
    updateDoc,
    query,
    where,
    collection,
    deleteDoc
} = require('firebase/firestore');
const {db} = require('../lib/firebase');
const ERROR = require('../constants/ErrorCode');
const passport = require('passport');
const {getAllTransactions, updateStatus} = require("../models/transaction");
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await getAllTransactions();
        return res.status(200).json({message: "Get Transactions successfully", data: transactions});
    } catch (err) {
        console.error('Error fetching transactions:', err);
        return res.status(500).json({error: 'Failed to fetch transactions'});
    }
}

exports.updateTransactionStatus = async (req, res) => {
    const {transactionId} = req.params;
    const {status} = req.body;

    if (!transactionId || !status) {
        return res.status(ERROR.BAD_REQUEST.code).json({error: ERROR.BAD_REQUEST.message});
    }

    if (!Object.values(DELIVERY).includes(status)) {
        return res.status(ERROR.BAD_REQUEST.code).json({error: `Invalid status. Valid statuses are: ${Object.values(DELIVERY).join(', ')}`});
    }

    try {
        const updatedTransaction = await updateStatus(transactionId, status);
        return res.status(200).json({message: 'Transaction status updated successfully', data: updatedTransaction});
    } catch (err) {
        console.error('Error updating transaction status:', err);
        return res.status(ERROR.INTERNAL_SERVER_ERROR.code).json({error: ERROR.INTERNAL_SERVER_ERROR.message});
    }
}

exports.getTransactionsBySessionId = async (req, res) => {
    const {sessionId} = req.params;

    if (!sessionId) {
        return res.status(ERROR.BAD_REQUEST.code).json({error: ERROR.BAD_REQUEST.message});
    }

    try {
        const transactionRef = doc(db, "transactions", sessionId);
        const transactionSnap = await getDoc(transactionRef);

        if (!transactionSnap.exists()) {
            return res.status(ERROR.NOT_FOUND.code).json({error: ERROR.NOT_FOUND.message});
        }

        const transactionData = transactionSnap.data();
        return res.status(200).json({message: "Transaction found", data: transactionData});
    } catch (err) {
        console.error('Error fetching transaction:', err);
        return res.status(ERROR.INTERNAL_SERVER_ERROR.code).json({error: ERROR.INTERNAL_SERVER_ERROR.message});
    }
}

exports.getTransactionsByUserId = async (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(ERROR.BAD_REQUEST.code).json({error: ERROR.BAD_REQUEST.message});
    }

    try {
        const transactionsRef = collection(db, "transactions");
        const q = query(transactionsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return res.status(ERROR.NOT_FOUND.code).json({error: ERROR.NOT_FOUND.message});
        }
        const transactions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return res.status(200).json({message: "Transactions found", data: transactions});
    }catch (err) {
        console.error('Error fetching transactions by userId:', err);
        return res.status(ERROR.INTERNAL_SERVER_ERROR.code).json({error: ERROR.INTERNAL_SERVER_ERROR.message});
    }
}

// Ham nay metadata co van de userId, deliveryStatus
exports.syncTransactions = async (req, res) => {
    try {
        const userId = req.query.userId;
        const sessions = await stripe.checkout.sessions.list({
            limit: 100,
            status: "complete",
            expand: ["data.payment_intent.payment_method", "data.line_items"],
        });

        const validSessions = sessions.data.filter(
            (session) =>
                session.payment_status === "paid" &&
                (!userId || session.client_reference_id === userId)
        );

        if (validSessions.length === 0) {
            return res.status(200).json({message: "No transactions to sync", data: 0});
        }

        const batch = writeBatch(db);
        validSessions.forEach((session) => {
            const transactionData = {
                sessionId: session.id,
                userId: '4e53e1ec-f1ad-4e5e-983b-09d2e7cdfacd',
                amountTotal: session.amount_total / 100,
                currency: session.currency,
                paymentStatus: session.payment_status,
                deliveryStatus: 'pending',
                createdAt: new Date(session.created * 1000).toISOString(),
            };

            const transactionRef = doc(db, "transactions", session.id);
            batch.set(transactionRef, transactionData);
        });

        await batch.commit();
        return res.status(200).json({
            message: "Transactions synced successfully",
            data: validSessions.length,
        });
    } catch (err) {
        console.error("Error syncing transactions:", err);
        return res
            .status(ERROR.INTERNAL_SERVER_ERROR.code)
            .json({error: ERROR.INTERNAL_SERVER_ERROR.message});
    }
};