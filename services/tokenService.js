require('dotenv').config()
const jwt = require('jsonwebtoken');

// const { JWT_SECRET, REFRESH_TOKEN_SECRET, JWT_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } = require('../config/jwtConfig');
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN

const generateAccessToken = (admin) => {
    return jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN, 
    });
};

const generateRefreshToken = (admin) => {
    return jwt.sign({ id: admin._id, role: 'admin' }, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
};

module.exports = { generateAccessToken, generateRefreshToken };
