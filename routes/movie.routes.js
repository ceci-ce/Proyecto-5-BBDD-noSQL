const express = require('express');
const Movie = require('../models/Movie');
const router = express.Router();

// 1. GET todas las películas
router.get('/', async (req, res, next) => { 
    try {
        const movies = await Movie.find();
        return res.status(200).json(movies);
    } catch (error) {
        return next(error); 
    }
});

// 2. GET película por id
router.get('/id/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      const error = new Error('Movie not found');
      error.status = 404;
      return next(error);
    }

    return res.status(200).json(movie);
  } catch (error) {
    return next(error);
  }
});

// 3. GET película por título
router.get('/title/:title', async (req, res, next) => {
  try {
    const movies = await Movie.find({
      title: req.params.title
    });

    return res.status(200).json(movies);
  } catch (error) {
    return next(error);
  }
});

// 4. GET película por género
router.get('/genre/:genre', async (req, res, next) => {
  try {
    const movies = await Movie.find({
      genre: req.params.genre
    });

    return res.status(200).json(movies);
  } catch (error) {
    return next(error);
  }
});

// 5. GET películas a partir de 2010
router.get('/year/:year', async (req, res, next) => {
  try {
    const movies = await Movie.find({
      year: { $gt: Number(req.params.year) }
    });

    return res.status(200).json(movies);
  } catch (error) {
    return next(error);
  }
});


// 6. POST nueva película
router.post('/create', async (req, res, next) => {
  try {
    // Creamos una nueva película con los datos enviados
    const newMovie = new Movie({
      title: req.body.title,
      director: req.body.director,
      year: req.body.year,
      genre: req.body.genre
    });

    // Guardamos la película en la base de datos
    const createdMovie = await newMovie.save();

    return res.status(201).json(createdMovie);
  } catch (error) {
    // Enviamos el error al middleware global
    next(error);
  }
});

// 7. PUT modificar película 
router.put('/edit/:id', async (req, res, next) => {
  try {
    const { id } = req.params; // Recuperamos el id de la URL

    // Instanciamos una nueva Movie con los datos del body
    const movieModify = new Movie(req.body);

    // Añadimos el _id a la película creada
    movieModify._id = id;

    // Actualizamos la película
    const movieUpdated = await Movie.findByIdAndUpdate(
      id,
      movieModify
    );

    // Devuelve la película ANTES de modificarse
    return res.status(200).json(movieUpdated);

  } catch (error) {
    return next(error);
  }
});

// 8. DELETE eliminar película 
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

    if (!deletedMovie) {
      const error = new Error('Movie not found');
      error.status = 404;
      return next(error);
    }

    return res.status(200).json('Movie deleted successfully');
  } catch (error) {
    return next(error);
  }
});

module.exports = router;