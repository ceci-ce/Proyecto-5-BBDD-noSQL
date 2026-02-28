const express = require('express');
const { connect } = require('./utils/db');

connect();

const PORT = 3000;
const server = express();

// Middleware para leer JSON
server.use(express.json());


// Importamos las rutas
const movieRoutes = require('./routes/movie.routes');

// Usamos las rutas
server.use('/api/movies', movieRoutes);

// Ruta no encontrada (404)
server.use((req, res, next) => {
	const error = new Error('Route not found'); 
	error.status = 404;
	next(error); 
});

// Middleware global de errores
server.use((error, req, res, next) => {
  console.error(error);

  return res.status(error.status || 500).json({
    message: error.message || 'Internal Server Error'
  });
});


// Arranque del servidor
server.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});