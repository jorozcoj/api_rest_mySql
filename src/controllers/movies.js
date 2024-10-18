//import { MovieModel } from "../models/movie.js";
import { MovieModel } from "../models/database/movie.js";
import {
  validateMovie,
  validatePartialMovie,
} from "../../schemas/movieValidator.js";

export class MovieController {
  static async getAll(req, res) {
    const { genre, title } = req.query;
    const moviesList = await MovieModel.getAll({ genre, title });

    res.json(moviesList);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const movie = await MovieModel.getById({ id });
    if (movie) return res.json(movie);

    res.status(404).send("<h1>Movie not found</h1>");
  }

  static async create(req, res) {
    const result = validateMovie(req.body);
    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newMovie = await MovieModel.create({ input: result.data });

    res.status(201).json(newMovie);
  }

  static async update(req, res) {
    const result = validatePartialMovie(req.body);

    if (!result.success) {
      return res.status(404).json({ error: JSON.parse(result.error.message) });
    }

    const { id } = req.params;
    const updatedMovie = await MovieModel.update({ id, input: result.data });

    return res.json(updatedMovie);
  }

  static async deleteMovie(req, res) {
    const { id } = req.params;

    const result = await MovieModel.deleteMovie({ id });
    if (result === false) {
      return res.status(404).json({ message: "Movie not found" });
    }

    return res.json({ message: "Movie deleted" });
  }

  static async paginateMovie(req, res) {
    const totalItem = moviesList.length;
    const itemByPage = 5;
    let totalPages = totalItem / itemByPage;
    let pageNumber = 1;
    const itemToSkip = (pageNumber - 1) * itemByPage;
    const items = moviesList.slice(itemToSkip, itemByPage + itemToSkip);

    console.log(items);
    await res.json(items);
  }
}
