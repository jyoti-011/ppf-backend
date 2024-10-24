const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assuming you have a User model
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }, // Assuming you have a Shop model
    items: [{ itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }, quantity: Number }],
    pickupTime: { type: Date },
    status: { type: String, default: 'Pending' }, // e.g., Pending, Accepted, Rejected, Completed
}, { timestamps: true }); // Add timestamps for created and updated times

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
