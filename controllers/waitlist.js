const {db} = require('../lib/firebase');
const passport = require('passport');
const {createWaitlist} = require("../models/waitlist");

exports.createWaitlist = [
    passport.authenticate('jwt', {session: false}), async (req, res) => {
        const {
            customer,
            stylist = {},
            services = [],
            entry = [],
            total,
        } = req.body;

        try{
            const waitlistId = await createWaitlist({
                customer,
                stylist,
                services,
                entry,
                total,
            })
            return res.status(200).json({
                message: 'Waitlist created successfully',
                data: {
                    waitlistId,
                }
            });
        }catch (err) {
            console.error('Error creating waitlist:', err);
            return res.status(500).json({error: 'Failed to create waitlist'});
        }
    }
];