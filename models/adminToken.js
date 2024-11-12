const mongoose = require('mongoose');

const adminTokenSchema = new mongoose.Schema({
    refreshToken: { type: String, required: true },
    accessToken: { type: String, required: true },
    accessTokenExpiry: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

const AdminToken = mongoose.model('AdminToken', adminTokenSchema);

module.exports = AdminToken;
