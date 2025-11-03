const {doc, setDoc, getDocs, getDoc, updateDoc, query, where, collection, deleteDoc} = require('firebase/firestore');
const {db} = require('../lib/firebase');
const {v4: uuid} = require('uuid');

const createStylist = async ({name, avatar, rating = 0, services = [], isVerified = false}) => {}

const getStylistById = async (stylistId) => {
    const stylistRef = doc(db, 'stylists', stylistId);
    const stylistSnapshot = await getDoc(stylistRef);
    if (!stylistSnapshot.exists()) {
        return null;
    }
    return {
        stylistId: stylistSnapshot.id,
        ...stylistSnapshot.data(),
    };
}

const getAllStylists = async () => {
    const stylistsCollection = collection(db, 'stylists');
    const stylistsSnapshot = await getDocs(stylistsCollection);
    const stylists = [];
    stylistsSnapshot.forEach(doc => {
        const stylistData = doc.data();
        stylists.push({
            stylistId: doc.id,
            ...stylistData,
        });
    });
    return stylists;
}

module.exports = {createStylist, getStylistById, getAllStylists}