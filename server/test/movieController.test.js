// movieController.test.js

const axios = require('axios');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index'); // Replace with the path to your Express app

let mongoServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('DELETE /api/movies/:id', () => {
  it('should delete a movie by ID', async () => {
    // Mock movie data
    const movieId = mongoose.Types.ObjectId();
    const movieData = { _id: movieId, title: 'Test Movie', director: 'Test Director', year: 2023 };

    // Create a movie in MongoDB
    await mongoose.connection.collection('movies').insertOne(movieData);

    // Send DELETE request
    const response = await request(app)
      .delete(`/api/movies/${movieId}`)
      .expect(200);

    // Assert response
    expect(response.body.message).toBe('Deleted movie');

    // Verify movie is deleted
    const deletedMovie = await mongoose.connection.collection('movies').findOne({ _id: movieId });
    expect(deletedMovie).toBeNull();
  });

  it('should return 404 if movie not found', async () => {
    const nonExistingMovieId = mongoose.Types.ObjectId();

    // Send DELETE request for non-existing movie
    const response = await request(app)
      .delete(`/api/movies/${nonExistingMovieId}`)
      .expect(404);

    // Assert response
    expect(response.body.message).toBe('Movie not found');
  });

  it('should return 400 if invalid movie ID', async () => {
    const invalidMovieId = 'invalid-id';

    // Send DELETE request with invalid ID
    const response = await request(app)
      .delete(`/api/movies/${invalidMovieId}`)
      .expect(400);

    // Assert response
    expect(response.body.message).toBe('Invalid movie ID');
  });
});
