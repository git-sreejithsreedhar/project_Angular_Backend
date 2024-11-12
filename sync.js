// // sync.js
// const sequelize = require('./db'); // Import the sequelize instance
// const User = require('./models/user'); // Import the User model

// const syncDatabase = async () => {
//     try {
//         await sequelize.sync(); // Sync all models
//         console.log('All models were synchronized successfully.');
//     } catch (error) {
//         console.error('Error synchronizing models:', error);
//     }
// };

// syncDatabase();


// // sync.js
// const sequelize = require('./db'); // Ensure you have your database connection
// const User = require('./models/User'); // Import your models here

// const syncDatabase = async () => {
//     try {
//         // Synchronize all defined models to the DB.
//         await sequelize.sync({ force: true }); // Use { force: true } to drop and recreate tables (for development only)
//         console.log('Database synchronized successfully.');
//     } catch (error) {
//         console.error('Error synchronizing models:', error);
//     }
// };

// // Call the sync function
// syncDatabase();
