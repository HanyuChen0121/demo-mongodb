import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({
    title: '',
    director: '',
    year: '',
    genre: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editMovieId, setEditMovieId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(2); // Adjust as needed
  const [paginatedMovies, setPaginatedMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []); // Fetch movies once on component mount

  useEffect(() => {
    paginateMovies();
  }, [movies, currentPage]); // Paginate movies whenever movies or currentPage changes

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/movies');
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const paginateMovies = () => {
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    setPaginatedMovies(movies.slice(startIndex, endIndex));
  };

  const addMovie = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/movies', newMovie);
      setMovies([...movies, response.data]);
      setNewMovie({ title: '', director: '', year: '', genre: '' });
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  const deleteMovie = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/movies/${id}`);
      setMovies(prevMovies => prevMovies.filter(movie => movie._id !== id));
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  const updateMovie = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5001/api/movies/${id}`, newMovie);
      const updatedMovies = movies.map(movie => (movie._id === id ? response.data : movie));
      setMovies(updatedMovies);
      setEditMode(false);
      setEditMovieId('');
      setNewMovie({ title: '', director: '', year: '', genre: '' });
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie({ ...newMovie, [name]: value });
  };

  const handleUpdateClick = (id) => {
    const movieToUpdate = movies.find(movie => movie._id === id);
    setEditMode(true);
    setEditMovieId(id);
    setNewMovie({
      title: movieToUpdate.title,
      director: movieToUpdate.director,
      year: movieToUpdate.year,
      genre: movieToUpdate.genre.join(', ')
    });
  };

  const handleCancelUpdate = () => {
    setEditMode(false);
    setEditMovieId('');
    setNewMovie({ title: '', director: '', year: '', genre: '' });
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Movies</h1>
      <div className="mb-4">
        <h2>Add Movie</h2>
        <div className="card p-3 mb-3">
          <div className="form-group">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newMovie.title}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="director"
              placeholder="Director"
              value={newMovie.director}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              name="year"
              placeholder="Year"
              value={newMovie.year}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="genre"
              placeholder="Genre"
              value={newMovie.genre}
              onChange={handleInputChange}
              className="form-control mb-2"
            />
          </div>
          {editMode ? (
            <div>
              <button onClick={() => updateMovie(editMovieId)} className="btn btn-primary mr-2">Update</button>
              <button onClick={handleCancelUpdate} className="btn btn-secondary">Cancel</button>
            </div>
          ) : (
            <button onClick={addMovie} className="btn btn-primary">Add Movie</button>
          )}
        </div>
      </div>
      <div>
        <h2>Movie List</h2>
        <div className="row">
          {paginatedMovies.map(movie => (
            <div key={movie._id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{movie.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{movie.director}</h6>
                  <p className="card-text">Year: {movie.year}</p>
                  <p className="card-text">Genre: {movie.genre.join(', ')}</p>
                  {editMode && editMovieId === movie._id ? (
                    <button onClick={() => updateMovie(movie._id)} className="btn btn-success mr-2">Save</button>
                  ) : (
                    <button onClick={() => handleUpdateClick(movie._id)} className="btn btn-warning mr-2">Edit</button>
                  )}
                  <button onClick={() => deleteMovie(movie._id)} className="btn btn-danger">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
            </li>
            <li className="page-item disabled">
              <span className="page-link">Page {currentPage}</span>
            </li>
            <li className="page-item">
              <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Movies;
