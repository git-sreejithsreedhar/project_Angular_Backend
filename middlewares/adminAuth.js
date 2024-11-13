const jwt = require('jsonwebtoken');

require('dotenv').config();


const JWT_SECRET = process.env.JWT_SECRET;

const authenticateAdminToken = (req, res, next) => {
    // const authHeader = req.headers['Authentication'];
    const authHeader = req.headers['authorization'];
    
    const token = authHeader?.split(' ')[1];

    if (!token) { return res.sendStatus(401) };

    jwt.verify(token, JWT_SECRET, (err, admin) => {
        if(err) { return res.status(403) };
        
        req.user = admin
        next();
    })
}

module.exports = authenticateAdminToken;

