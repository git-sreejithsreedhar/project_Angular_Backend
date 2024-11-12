const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/your_database_name', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); 
    }
};

module.exports = connectDB;


















// // db.js
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('login_page', 'login_page', '1234', {
//     host: 'localhost',
//     dialect: 'postgres', // Choose 'mysql' | 'mariadb' | 'sqlite' | 'mssql'
// });

// // Test the connection
// sequelize.authenticate()
//     .then(() => {
//         console.log('Connection to PostgreSQL has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });

// module.exports = sequelize;

// db.js



