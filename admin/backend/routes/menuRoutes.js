// routes/menuRoutes.js
const express = require('express');
const MenuItem = require('../models/menu');
const router = express.Router();

// Add a new menu item
router.post('/add', async (req, res) => {
    const { shopId, name, price, description } = req.body;
    try {
        const menuItem = new MenuItem({ shopId, name, price, description });
        await menuItem.save();
        res.status(201).json({ message: 'Menu item added successfully', menuItem });
    } catch (err) {
        res.status(500).json({ message: 'Error adding menu item' });
    }
});

// Fetch menu items for a shop
router.get('/:shopId', async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ shopId: req.params.shopId });
        res.status(200).json(menuItems);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching menu items' });
    }
});

// Update a menu item
router.put('/:id', async (req, res) => {
    try {
        const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Menu item updated successfully', updatedItem });
    } catch (err) {
        res.status(500).json({ message: 'Error updating menu item' });
    }
});

module.exports = router;
