const express = require("express");

const app = express();
const moviesList = require("./movies.json");
const cors = require("cors");
const crypto = require("node:crypto");
const PORT = process.env.PORT ?? 1234;

const {
  validateMovie,
  validatePartialMovie,
} = require("./schemas/movieValidator");

app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        "http://localhost:8080",
        "http://localhost:1234",
        "https://movies.com",
        "http://127.0.0.1/*",
      ];

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.disable("x-powered-by");

//middleware

app.use(express.json());

//get movies by genre or by movie name
app.get("/movies", (req, res) => {
  //res.header('Access-Control-Allow-Origin','*')
  const { genre, title } = req.query;
  if (genre) {
    const filteredMovie = moviesList.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    );

    return res.json(filteredMovie);
  } else if (title) {
    const filteredMovie = moviesList.filter(
      movie => movie.title.toLowerCase() === title.toLowerCase()
    );

    return res.json(filteredMovie);
  }

  res.json(moviesList);
});


//pagination
app.get("/movies/pages", (req, res) => {
  const totalItem = moviesList.length;
  const itemByPage = 5;
  let totalPages = totalItem / itemByPage;
  let pageNumber = 1;
  const itemToSkip = (pageNumber - 1) * itemByPage;
  const items = moviesList.slice(itemToSkip, itemByPage + itemToSkip);

  console.log(items);
  res.json(items);
});

//get movie by id (segmentos dinámicos)
app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = moviesList.find((movie) => movie.id === id);
  if (movie) return res.json(movie);

  res.status(404).send("<h1>Movie not found</h1>");
});


//CREAR UNA NUEVA PELICULA
app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);
  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  };

  moviesList.push(newMovie);

  res.status(201).json(newMovie);
});

/* //CREAR UNA PELICULA SIN EXPRESS
app.post("/movies", (req, res) => {
  let body = "";
  req.on("data", (trozo) => {
    body += trozo.toString();
  });
  req.on("end", () => {
    const data = JSON.parse(body);
    res.writeHead(201, {
      "Content-Type": "application/json; charset=utf-8",
    });
    req.body = data;
    res.end(JSON.stringify(data));
  });
});
 */

//actualizar una pelicula
app.patch("/movies/:id", (req, res) => {
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

app.delete("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = moviesList.findIndex((movie) => movie.id === id);
  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  moviesList.splice(movieIndex, 1);

  return res.json({ message: "Movie deleted" });
});

app.options("/movies/:id", (req, res) => {
  const origin = req.header("origin");

  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header("Access-control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  }
  res.send(200);
});

//PUERTO EN EL QUE VA A ESCUCHAR
app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});

app.use((req, res) => {
  res.status(404).send("<h1>page not found</h1>");
});
