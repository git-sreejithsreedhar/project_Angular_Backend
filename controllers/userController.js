const users = require('../models/userModel');
const router = require('../routes/userRoutes')

const userController = {
    // Get all users
    getAllUsers: async (req, res, next) => {
        res.render('user', { users }); // Render the user view with user data
    },


    userRegister: async (req, res, next) => {
        try {
            const userData = req.body; 
            
            users.push(userData);
            console.log(userData);

            res.render('user', { users });
            res.status(201).json({ message: "User registered successfully", user: userData });
        } catch (error) {
            console.error(error); // Log the error for debugging
            res.status(500).json({ message: "An error occurred while registering the user" });
        }
    }
    
    
    
};

// Export the controller directly
module.exports = userController;

