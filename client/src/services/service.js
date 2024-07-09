import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api'
});

export const fetchMovies = async () => {
  try {
    const response = await api.get('/movies');
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const addMovie = async (movie) => {
  try {
    const response = await api.post('/movies', movie);
    return response.data;
  } catch (error) {
    console.error('Error adding movie:', error);
    throw error;
  }
};

export const updateMovie = async (id, movie) => {
  try {
    const response = await api.put(`/movies/${id}`, movie);
    return response.data;
  } catch (error) {
    console.error('Error updating movie:', error);
    throw error;
  }
};

export const deleteMovie = async (id) => {
  try {
    await api.delete(`/movies/${id}`);
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
};
