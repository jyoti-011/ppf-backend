const express = require('express');
const bcrypt = require('bcrypt');
const Shop = require('../models/shop'); // Ensure this path is correct
const router = express.Router();

// Shop signup route
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the shop already exists
        const existingShop = await Shop.findOne({ email });
        if (existingShop) {
            return res.status(400).json({ message: 'Shop already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new shop
        const newShop = new Shop({ name, email, password: hashedPassword });
        await newShop.save();

        res.status(201).json({ message: 'Shop registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Shop login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the shop by email
        const shop = await Shop.findOne({ email });
        if (!shop) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, shop.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Save shop info in session
        req.session.shopId = shop._id;
        res.json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }  
});

// Fetch all shops for the admin dashboard
router.get('/all', async (req, res) => {
    try {
        const shops = await Shop.find({});
        res.status(200).json({ shops });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a shop by ID
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const shop = await Shop.findByIdAndDelete(id);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        res.status(200).json({ message: 'Shop deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout route for admin
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout error' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});


module.exports = router;
