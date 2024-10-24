const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session'); // Required for session handling
const MongoStore = require('connect-mongo'); // Ensure you install this package if not done
const shopRoutes = require('./routes/shopRoutes'); // Correct import for your routes
const path = require('path');
const Menu = require('./models/menu'); // Assuming you have a Menu model
const Order = require('./models/order'); // Make sure to import the Order model

const app = express();
const PORT = 8080;

// MongoDB connection string
const DB = 'mongodb+srv://jyotipal4112003:jojo%402904@cluster-ppf.hhhag.mongodb.net/ppf?retryWrites=true&w=majority';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../frontend')));

// Session middleware
app.use(session({
    secret: 'your_secret_key', // Change this to a random secret key
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: DB }), // Use MongoDB to store session
}));

// MongoDB connection
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// POST: Add/update menu item
app.post('/api/menu', async (req, res) => {
    const { itemName, itemPrice } = req.body;
    try {
        // Add or update the menu item in your database
        await Menu.updateOne({ name: itemName }, { name: itemName, price: itemPrice }, { upsert: true });
        res.status(200).json({ message: 'Menu item added/updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add/update item' });
    }
});

// GET: Fetch all menu items
app.get('/api/menu', async (req, res) => {
    try {
        const menuItems = await Menu.find({});
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch menu' });
    }
});

// GET: Fetch all pending orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find({ status: 'Pending' }).populate('userId shopId items.itemId'); // Populate related fields for better clarity
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// POST: Accept order
app.post('/api/orders/:orderId/accept', async (req, res) => {
    try {
        await Order.updateOne({ _id: req.params.orderId }, { status: 'Accepted' }); // Ensure consistent status capitalization
        res.status(200).json({ message: 'Order accepted!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to accept order' });
    }
});

// POST: Reject order
app.post('/api/orders/:orderId/reject', async (req, res) => {
    try {
        await Order.updateOne({ _id: req.params.orderId }, { status: 'Rejected' });
        res.status(200).json({ message: 'Order rejected!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject order' });
    }
});

// Routes
app.use('/shop', shopRoutes); // Correctly mount the routes und

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
