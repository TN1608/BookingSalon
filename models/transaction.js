const {doc, setDoc, getDocs, getDoc, updateDoc, query, where, collection, deleteDoc} = require('firebase/firestore');
const {db} = require('../lib/firebase');
const {v4: uuid} = require('uuid');
const ERROR = require('../constants/ErrorCode');

const getAllTransactions = async () => {
    const transactionsCollection = collection(db, 'transactions');
    const transactionsSnapshot = await getDocs(transactionsCollection);
    if (transactionsSnapshot.empty) {
        return [];
    }
    const transactions = [];
    transactionsSnapshot.forEach(doc => {
        const transactionData = doc.data();
        transactions.push({
            transactionId: doc.id,
            ...transactionData,
        });
    });
    return transactions;
}

const updateStatus = async (transactionId, status) => {
    const transactionRef = doc(db, 'transactions', transactionId);
    const transactionSnapshot = await getDoc(transactionRef);
    if (!transactionSnapshot.exists()) {
        return null;
    }
    await updateDoc(transactionRef, {
        deliveryStatus: status,
        updatedAt: new Date().toISOString(),
    });
    return {
        transactionId: transactionSnapshot.id,
        ...transactionSnapshot.data(),
        deliveryStatus: status,
        updatedAt: new Date().toISOString(),
    };
}

module.exports = {
    getAllTransactions,
    updateStatus,
}