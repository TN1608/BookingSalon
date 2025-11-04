const express = require('express');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const { doc, updateDoc, serverTimestamp } = require('firebase/firestore');
const { db } = require('../lib/firebase');
const {notifyAppointmentUpdate} = require("../controllers/sse");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const router = express.Router();

const rawJson = bodyParser.raw({ type: 'application/json' });

router.post('/webhook', rawJson, async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const appointmentId = session.metadata?.appointmentId;
                if (appointmentId) {
                    await updateDoc(doc(db, 'appointments', String(appointmentId)), {
                        status: 'confirmed',
                        stripeSessionId: session.id,
                        stripePaymentIntentId: session.payment_intent || null,
                        paid: true,
                        paidAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                    });

                    notifyAppointmentUpdate(appointmentId, {
                        status: 'confirmed',
                        sessionId: session.id,
                    });
                } else {
                    console.warn('checkout.session.completed: missing appointmentId in metadata');
                }
                break;
            }

            case 'checkout.session.expired': {
                const session = event.data.object;
                const appointmentId = session.metadata?.appointmentId;
                if (appointmentId) {
                    await updateDoc(doc(db, 'appointments', String(appointmentId)), {
                        status: 'expired',
                        updatedAt: serverTimestamp(),
                    });
                    notifyAppointmentUpdate(appointmentId, { status: 'expired' });
                }
                break;
            }

            default:
                console.log('Unhandled Stripe event type:', event.type);
        }

        res.json({ received: true });
    } catch (err) {
        console.error('Error handling webhook event:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;