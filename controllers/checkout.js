const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
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

exports.checkoutSession = [
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        const {lineItems} = req.body;
        try {
            if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
                return res.status(400).json({error: 'Invalid line items'});
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems.map(item => ({
                    price: item.price,
                    quantity: item.quantity
                })),
                mode: 'payment',
                success_url: `${process.env.SUCCESS_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: process.env.CANCEL_URL,
                metadata: {
                    userId: req.user.id,
                },
                payment_intent_data: {
                    metadata: {
                        userId: req.user.id,
                    }
                }
            });

            return res.status(200).json({data: session.id});
        } catch (err) {
            console.error('Error creating checkout session:', err);
            return res.status(500).json({error: 'Failed to create checkout session'});
        }
    }
]

exports.syncItems = async (req, res) => {
    try {
        const itemsSnapshot = await getDocs(collection(db, 'items'));
        const items = itemsSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

        for (const item of items) {
            const stripeProduct = await stripe.products.create({
                name: item.name,
                default_price_data: {
                    unit_amount: item.price * 100, // Stripe expects amount in cents
                    currency: 'usd',
                },
                description: item.description | '',
            });

            const stripePrice = await stripe.prices.create({
                product: stripeProduct.id,
                unit_amount: item.price * 100,
                currency: 'usd',
            });

            await updateDoc(doc(db, 'items', item.id), {
                stripeProductId: stripeProduct.id,
                stripePriceId: stripePrice.id,
            });
        }

        return res.status(200).json({message: 'Products synced successfully'});
    } catch (err) {
        console.error('Error syncing products:', err);
        return res.status(500).json({error: 'Failed to sync products'});
    }
}