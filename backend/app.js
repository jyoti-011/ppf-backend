const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const path = require('path');
const MongoStore = require('connect-mongo');

const app = express();
const PORT = 8000;

// MongoDB connection string (update it with your details)
const DB = 'mongodb+srv://jyotipal4112003:jojo%402904@cluster-ppf.hhhag.mongodb.net/ppf?retryWrites=true&w=majority&appName=cluster-ppf';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB connection
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tlsInsecure: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Routes
app.use('/auth', authRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
