const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');
const logger = require('../utils/logger');
// GET all movies
router.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
    logger.info('Operation successful.');
  } catch (err) {
    res.status(500).json({ message: err.message });
    logger.error('Error occurred:', error);
  }

});

// POST a new movie
router.post('/movies', async (req, res) => {
  const movie = new Movie({
    title: req.body.title,
    director: req.body.director,
    year: req.body.year,
    genre: req.body.genre,
  });

  try {
    const newMovie = await movie.save();
    res.status(201).json(newMovie);
    logger.info('Operation successful.');
  } catch (err) {
    res.status(400).json({ message: err.message });
    logger.error('Error occurred:', error);
  }
});

// PUT update a movie
router.put('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie == null) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    movie.title = req.body.title;
    movie.director = req.body.director;
    movie.year = req.body.year;
    movie.genre = req.body.genre;

    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a movie
router.delete('/movies/:id', async (req, res) => {
    try {
      const movie = await Movie.findByIdAndDelete(req.params.id);
      if (!movie) return res.status(404).json({ message: 'Cannot find movie' });
      res.json({ message: 'Deleted movie' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;