// routes/orderRoutes.js
const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Place a new order
router.post('/place', async (req, res) => {
    const { userId, shopId, items } = req.body;
    try {
        const order = new Order({ userId, shopId, items });
        await order.save();
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (err) {
        res.status(500).json({ message: 'Error placing order' });
    }
});

// Fetch orders for a shop
router.get('/shop/:shopId', async (req, res) => {
    try {
        const orders = await Order.find({ shopId: req.params.shopId });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Update pickup time for an order
router.put('/update/:id', async (req, res) => {
    const { pickupTime } = req.body;
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { pickupTime }, { new: true });
        res.status(200).json({ message: 'Order updated successfully', updatedOrder });
    } catch (err) {
        res.status(500).json({ message: 'Error updating order' });
    }
});

module.exports = router;
