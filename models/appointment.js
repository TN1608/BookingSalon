const {doc, setDoc, getDocs, getDoc, updateDoc, query, where, collection, deleteDoc} = require('firebase/firestore');
const {db} = require('../lib/firebase');
const {v4: uuid} = require('uuid');

const createAppointment = async ({customerId, stylistId, startTime, duration, notes = "", status, services = [], discountPercent = 0, finalPrice}) => {
    const appointmentId = uuid();
    const createdAt = new Date().toISOString();
    const start = new Date(startTime);
    const end = new Date(start.getTime() + (duration || 0) * 60000);

    const appointmentRef = doc(db, 'appointments');
    await setDoc(appointmentRef, {
        appointmentId,
        customerId,
        stylistId,
        finalPrice,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        duration,
        notes,
        status,
        services,
        discountPercent,
        createdAt,
        updatedAt: createdAt,
    });

    return appointmentId;
}

const getAppointmentsByCustomerId = async (customerId) => {
    const appointmentsCollection = collection(db, 'appointments');
    const q = query(appointmentsCollection, where('customerId', '==', customerId));
    const appointmentsSnapshot = await getDocs(q);
    const appointments = [];
    appointmentsSnapshot.forEach(doc => {
        const appointmentData = doc.data();
        appointments.push({
            appointmentId: doc.id,
            ...appointmentData,
        });
    })
    return appointments;
}

const getAppointmentById = async (appointmentId) => {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    const appointmentSnapshot = await getDoc(appointmentRef);
    if (!appointmentSnapshot.exists()) {
        return null;
    }
    return {
        appointmentId: appointmentSnapshot.id,
        ...appointmentSnapshot.data(),
    };
}

const getAllAppointments = async () => {
    const appointmentsCollection = collection(db, 'appointments');
    const appointmentsSnapshot = await getDocs(appointmentsCollection);
    const appointments = [];
    appointmentsSnapshot.forEach(doc => {
        const appointmentData = doc.data();
        appointments.push({
            appointmentId: doc.id,
            ...appointmentData,
        });
    });
    return appointments;
}


module.exports = {createAppointment, getAppointmentsByCustomerId, getAppointmentById, getAllAppointments}