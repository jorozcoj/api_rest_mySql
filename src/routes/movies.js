import { Router } from "express";
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url)
const moviesList = require('../../movies.json')
import { validateMovie, validatePartialMovie } from "../../schemas/movieValidator.js";
import { randomUUID } from "node:crypto";

export const movieRouter = Router();


//OBTENER TODAS LAS PELICULAS
movieRouter.get("/", (req, res) => {
  const { genre, title } = req.query;
  if (genre) {
    const filteredMovie = moviesList.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );

    return res.json(filteredMovie);
  } else if (title) {
    const filteredMovie = filter(
      (movie) => movie.title.toLowerCase() === title.toLowerCase()
    );

    return res.json(filteredMovie);
  }

  res.json(moviesList);
});

//PAGINACIÓN
movieRouter.get("/pages", (req,res) => {
    const totalItem = moviesList.length;
    const itemByPage = 5;
    let totalPages = totalItem / itemByPage;
    let pageNumber = 1;
    const itemToSkip = (pageNumber - 1) * itemByPage;
    const items = moviesList.slice(itemToSkip, itemByPage + itemToSkip);

    console.log(items);
    res.json(items);
  });

//OBTENER UNA SOLA PELICULA
movieRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const movie = moviesList.find((movie) => movie.id === id);
  if (movie) return res.json(movie);

  res.status(404).send("<h1>Movie not found</h1>");
});

//CREAR UNA NUEVA PELICULA
movieRouter.post("/", (req, res) => {
  const result = validateMovie(req.body);
  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: randomUUID(),
    ...result.data,
  };

  moviesList.push(newMovie);

  res.status(201).json(newMovie);
});

//actualizar una pelicula
movieRouter.patch("/", (req, res) => {
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    return res.status(404).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = moviesList.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }
  const updateMovie = {
    ...moviesList[movieIndex],
    ...result.data,
  };
  moviesList[movieIndex] = updateMovie;

  return res.json(updateMovie);
});


//ELIMINAR UNA PELICULA
movieRouter.delete("/:id", (req, res) => {
    const { id } = req.params;
    const movieIndex = moviesList.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) {
      return res.status(404).json({ message: "Movie not found" });
    }
  
    moviesList.splice(movieIndex, 1);
  
    return res.json({ message: "Movie deleted" });
  });
