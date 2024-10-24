const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true }, // New field for phone number
    password: { type: String, required: true } // Store password in plain text (for testing purposes only)
});

module.exports = mongoose.model('User', userSchema);
