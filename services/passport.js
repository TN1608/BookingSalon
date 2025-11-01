const passport = require('passport');
const { getUserByEmail, comparePassword, createUser, updateUser, getUserById} = require('../models/auth');
const utils = require('../lib/utils');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const PROVIDER = require('../constants/enums/provider');
const { db } = require('../lib/firebase');
const { doc, updateDoc } = require('firebase/firestore');

// Local Strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return done(null, false, { error: 'Invalid email or password' });
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return done(null, false, { error: 'Invalid email or password' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
});

// JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: utils.secret,
};
const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        const user = await getUserById(payload.sub)
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    } catch (err) {
        done(err, false);
    }
});

// Google Strategy
const googleOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
};
const googleLogin = new GoogleStrategy(googleOptions, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        let user = await getUserByEmail(email);

        if (!user) {
            // Create new user if not exists
            user = await createUser({
                username: profile.displayName || email.split('@')[0],
                email,
                provider: PROVIDER.GOOGLE,
                googleId: profile.id,
                verified: true,
            });
        } else if (user.provider !== PROVIDER.GOOGLE) {
            // Update existing user to Google provider
            await updateDoc(doc(db, 'users', user.id), { provider: PROVIDER.GOOGLE, googleId: profile.id });
            user.provider = PROVIDER.GOOGLE;
        }
        console.log(`User authenticated with Google: ${user.email}`);
        return done(null, user);
    } catch (err) {
        return done(err);
    }
});

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await getUserByEmail(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
})

passport.use(jwtLogin);
passport.use(localLogin);
passport.use(googleLogin);