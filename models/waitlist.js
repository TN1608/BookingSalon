const {doc, setDoc, getDocs, getDoc, updateDoc, query, where, collection, deleteDoc} = require('firebase/firestore');
const {db} = require('../lib/firebase');
const {v4: uuid} = require('uuid');

const createWaitlist = async ({customer, stylist= {}, services = [], entry = [], total}) => {
    const waitlistId = uuid();
    const createdAt = new Date().toISOString();
    const waitlistRef = doc(db, 'waitlists', waitlistId);
    await setDoc(waitlistRef, {
        waitlistId,
        customer,
        stylist: stylist.id,
        services,
        entry,
        total,
        createdAt,
    })
    return waitlistId;
}

module.exports = {createWaitlist}


