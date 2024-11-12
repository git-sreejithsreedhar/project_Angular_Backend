// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define route for getting all users
router.get('/', userController.getAllUsers);
router.post('/user/register', userController.userRegister)















module.exports = router; // Export the router
