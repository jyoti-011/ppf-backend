const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

const JWT_SECRET = 'your_jwt_secret'; // Use a strong secret in production

// Signup Route
router.post('/signup', async (req, res) => {
    const { username, email, phone, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ username, email, phone, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Check if password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Send token as a cookie
        res.cookie('token', token, { httpOnly: true }).status(200).json({
            message: 'Login successful!',
            username: user.username
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// Middleware to authenticate and extract user data from the JWT token
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// GET route for user profile
router.get('/user/profile', authMiddleware, async (req, res) => {
    try {
        // Fetch the user data using the ID stored in the JWT
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
