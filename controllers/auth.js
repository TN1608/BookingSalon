const {createUser, getUserByEmail, comparePassword, updateUser, hashPassword} = require('../models/auth');
const jwt = require('jsonwebtoken');
const utils = require('../lib/utils');
const passport = require('passport');

const ERROR = require('../constants/ErrorCode');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    const expire = timestamp + 2 * 60 * 60 * 1000;
    return jwt.sign(
        {
            sub: user.id,
            iat: timestamp,
            exp: expire,
        },
        utils.secret
    )
}

exports.signup = async function (req, res, next) {
    const {fullName, email, password} = req.body;

    if (!email || !password) {
        return res.status(ERROR.EMAIL_OR_PASSWORD_INVALID.code).send({error: ERROR.EMAIL_OR_PASSWORD_INVALID});
    }

    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(ERROR.EMAIL_EXISTS.code).send({error: ERROR.EMAIL_EXISTS});
        }

        const user = await createUser({fullName, email, password});
        res.status(200).send({
            message: 'User registered successfully',
            data: tokenForUser(user),
        });
    } catch (err) {
        console.error('Error signing up:', err.message);
        return res.status(500).send({
            error: process.env.NODE_ENV === 'development' ? err.message : ERROR.INTERNAL_SERVER_ERROR,
        });
    }
};

exports.signin = [
    passport.authenticate('local', {session: false}),
    (req, res) => {
        res.status(200).send({
            message: 'User signed in successfully',
            data: tokenForUser(req.user),
        });
    },
]

exports.googleAuth = passport.authenticate('google', {session: false, scope: ['profile', 'email']});

exports.googleAuthCallback = [
    passport.authenticate('google', {
        session: false,
        failureRedirect: 'http://localhost:3000/auth/callback?error=Authentication failed'
    }),
    (req, res) => {
        if (!req.user) {
            return res.status(ERROR.UNAUTHORIZED.code).json({error: ERROR.UNAUTHORIZED});
        }
        // Nếu người dùng đã đăng nhập bằng Google, tạo token và chuyển hướng
        const token = tokenForUser(req.user);
        res.redirect(`http://localhost:3000/auth/callback?token=${token}`);
    },
];

exports.createPassword = [
    passport.authenticate('local', {session: false}),
    async (req, res) => {
        try {
            const {password} = req.body;
            if (!password) {
                return res.status(ERROR.PASSWORD_IS_REQUIRED.code).json({error: ERROR.PASSWORD_IS_REQUIRED});
            }

            const user = req.user;
            if (!user) {
                return res.status(ERROR.UNAUTHORIZED.code).json({error: ERROR.UNAUTHORIZED});
            }

            // Cập nhật mật khẩu
            const hashedPassword = await hashPassword(password);
            await updateUser(user.id, {
                password: hashedPassword,
                hasPassword: true,
            });

            res.status(200).send({message: 'Password created successfully'});
        } catch (err) {
            console.error('Error creating password:', err.message);
            res.status(500).json({
                error: process.env.NODE_ENV === 'development' ? err.message : ERROR.INTERNAL_SERVER_ERROR,
            });
        }
    },
];

exports.getUserProfile = [
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        try {
            const user = req.user;
            if (!user) {
                return res.status(ERROR.UNAUTHORIZED.code).json({error: ERROR.UNAUTHORIZED});
            }

            // Trả về thông tin người dùng
            res.json({
                message: 'User profile retrieved successfully',
                code: 200,
                data: {
                    fullName: user.fullName || 'Anonymous',
                    email: user.email,
                    provider: user.provider,
                    verified: user.verified,
                    googleId: user.googleId || null,
                    hasPassword: !!user.password,
                }
            });
        } catch (err) {
            console.error('Error fetching user profile:', err.message);
            res.status(500).json({
                error: process.env.NODE_ENV === 'development' ? err.message : ERROR.INTERNAL_SERVER_ERROR,
            });
        }
    },
];

exports.findByEmail = async (req, res) => {
    const {email} = req.query;
    if (!email) {
        return res.status(400).json({error: ERROR.EMAIL_IS_REQUIRED});
    }

    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({error: ERROR.USER_NOT_FOUND});
        }

        res.json({
            message: 'User found successfully',
            code: 200,
            data: {
                fullName: user.fullName || 'Anonymous',
                email: user.email,
                provider: user.provider,
                verified: user.verified,
                googleId: user.googleId || null,
            }
        });
    } catch (error) {
        console.error('Error finding user by email:', error.message);
        res.status(500).json({
            error: process.env.NODE_ENV === 'development' ? error.message : ERROR.INTERNAL_SERVER_ERROR,
        });
    }
}