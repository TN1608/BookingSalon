const jwt = require('jsonwebtoken');
const utils = require('../lib/utils');
const bcrypt = require('bcrypt-nodejs');
const {doc, setDoc, getDocs, getDoc, updateDoc, query, where, collection} = require('firebase/firestore');
const PROVIDER = require('../constants/enums/provider');
const {db} = require('../lib/firebase');
const {v4: uui} = require('uuid');

// Hàm hash mật khẩu
const hashPassword = async (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return reject(err);
            bcrypt.hash(password, salt, null, (err, hash) => {
                if (err) return reject(err);
                resolve(hash);
            });
        });
    });
};

// Hàm so sánh mật khẩu
const comparePassword = (candidatePassword, hashedPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, hashedPassword, (err, isMatch) => {
            if (err) return reject(err);
            resolve(isMatch);
        });
    });
};

// Hàm tạo người dùng
const createUser = async ({fullName, email, password, provider = PROVIDER.LOCAL, googleId, verified = false}) => {
    const userId = uui();
    const userRef = doc(db, 'users', userId);
    const hashedPassword = password ? await hashPassword(password) : null;
    await setDoc(userRef, {
        fullName,
        email,
        provider,
        verified,
        password: hashedPassword,
        googleId: googleId || null,
    });
    return {id: email, email, provider, verified, password: hashedPassword, googleId: googleId || null};
};


// Lay theo ID
const getUserById = async (id) => {
    const userRef = doc(db, 'users', id);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) return null;
    return {id: userDoc.id, ...userDoc.data()};
};

// Hàm lấy người dùng theo email
const getUserByEmail = async (email) => {
    const userRef = collection(db, 'users');
    const q = query(userRef, where('email', '==', email));
    const userSnapshot = await getDocs(q);
    if (userSnapshot.empty) return null;
    const userDoc = userSnapshot.docs[0];
    return {id: userDoc.id, ...userDoc.data()};
};

// Hàm cập nhật người dùng
const updateUser = async (email, updates) => {
    const userRef = doc(db, 'users', email);
    await updateDoc(userRef, updates);
    return await getUserByEmail(email);
};

const getUserFromToken = async (token) => {
    try {
        const decoded = jwt.verify(token, utils.secret);
        return await getUserByEmail(decoded.sub);
    } catch (err) {
        console.error('Token verification failed:', err.message);
        return null;
    }
}

module.exports = {
    hashPassword,
    getUserById,
    comparePassword,
    createUser,
    getUserByEmail,
    updateUser,
    getUserFromToken,
}