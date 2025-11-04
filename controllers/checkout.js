// javascript
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const {
    doc,
    updateDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    collection,
} = require('firebase/firestore');
const { db } = require('../lib/firebase');
const passport = require('passport');
const { createAppointment } = require('../models/appointment');

exports.checkoutSession = [
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        const {
            // userId,
            userEmail,
            // phone,
            services,
            totalPrice,
            discountPercent,
            startTime,
            totalDuration,
            stylist,
            notes,
        } = req.body;

        try {
            // const apptQuery = query(
            //     collection(db, 'appointments'),
            //     where('stylistId', '==', stylist.id),
            //     where('status', 'in', ['pending', 'confirmed'])
            // );
            // const snapshot = await getDocs(apptQuery);

            // const start = new Date(startTime);
            // const end = new Date(start.getTime() + totalDuration * 60000);
            // const conflict = snapshot.docs.some(d => {
            //     const appt = d.data();
            //     const s2 = new Date(appt.startTime);
            //     const e2 = new Date(appt.endTime);
            //     return start < e2 && end > s2;
            // });
            // if (conflict) return res.status(409).json({ message: 'Stylist is busy' });

            const finalPrice = totalPrice * (1 - (discountPercent || 0) / 100);
            const amountCents = Math.round(finalPrice * 100);

            const appointmentRef = await createAppointment({
                customer: userEmail,
                stylistId: stylist,
                finalPrice,
                startTime,
                duration: totalDuration,
                notes,
                status: 'pending',
                services,
                discountPercent,
            });

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: `Booking with ${stylist?.name || 'stylist'}`,
                                description: (services || []).map(s => s.name).join(', '),
                            },
                            unit_amount: amountCents,
                        },
                        quantity: 1,
                    },
                ],
                success_url: `${process.env.FRONTEND_URL}/success?appointment_id=${appointmentRef}&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/cancel?appointment_id=${appointmentRef}`,
                metadata: {
                    appointmentId: String(appointmentRef),
                    customer: String(userEmail),
                },
                payment_intent_data: {
                    metadata: {
                        appointmentId: String(appointmentRef),
                        customer: String(userEmail),
                    },
                },
            });

            await updateDoc(doc(db, 'appointments', String(appointmentRef)), {
                stripeSessionId: session.id,
                updatedAt: serverTimestamp(),
            });

            // return res.status(200).json({ data: session.id });
            return res.status(200).json({ data: session.url });
        } catch (err) {
            console.error('Error creating checkout session:', err);
            return res.status(500).json({ error: 'Failed to create checkout session' });
        }
    },
];

exports.syncItems = async (req, res) => {
    try {
        const itemsSnapshot = await getDocs(collection(db, 'items'));
        const items = itemsSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

        for (const item of items) {
            const priceCents = Math.round((item.price || 0) * 100);

            const stripeProduct = await stripe.products.create({
                name: item.name,
                description: item.description || '',
            });

            const stripePrice = await stripe.prices.create({
                product: stripeProduct.id,
                unit_amount: priceCents,
                currency: 'usd',
            });

            await updateDoc(doc(db, 'items', item.id), {
                stripeProductId: stripeProduct.id,
                stripePriceId: stripePrice.id,
            });
        }

        return res.status(200).json({ message: 'Products synced successfully' });
    } catch (err) {
        console.error('Error syncing products:', err);
        return res.status(500).json({ error: 'Failed to sync products' });
    }
};