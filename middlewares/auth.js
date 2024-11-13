
const jwt = require('jsonwebtoken');


const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'; 


const authenticateToken = (req, res, next) => {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];  

    if (!token) return res.sendStatus(401);  

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.log('Token verification error:', err);  
            return res.sendStatus(403); 
        }
        if (user) { console.log('aut', user)} //------------
        req.user = user;
        next(); 
    });
};



module.exports = authenticateToken; 


