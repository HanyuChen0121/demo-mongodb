// models/Movie.js

const mongoose = require('mongoose');

// Define Movie schema
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  director: String,
  year: Number,
  genre: [String],
});

// Create and export Movie model
module.exports = mongoose.model('Movie', movieSchema);