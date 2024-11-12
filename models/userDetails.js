const mongoose = require('mongoose');


const userDetailsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    profilePic: { type: String }
});


const userDetails = mongoose.model('UserDetails', userDetailsSchema);


module.exports = userDetails;

