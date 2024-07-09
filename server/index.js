// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const movieRouter = require('./controllers/movieControllers');
const cors = require('cors');

dotenv.config();
const app = express();

// Enable CORS for all routes
app.use(cors());

// Enable parsing JSON request bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://mattmelody0121:UsPpQm2ykofrAQGT@cluster0.bli2zcl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', 
                { useNewUrlParser: true, useUnifiedTopology: true })
                .then(() => {
                    console.log('Connected to MongoDB');
                })
                .catch(err => {
                    console.log('Error connecting to MongoDB', err);
                });

const db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB connection error:', err));
db.once('open', () => console.log('Connected to MongoDB'));

// Use movie routes
app.use('/api', movieRouter);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});