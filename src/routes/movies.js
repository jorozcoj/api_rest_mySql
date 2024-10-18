import { Router } from "express";

import { MovieController } from "../controllers/movies.js";

export const movieRouter = Router();


//OBTENER TODAS LAS PELICULAS
movieRouter.get("/", MovieController.getAll);

//OBTENER UNA SOLA PELICULA
movieRouter.get("/:id", MovieController.getById);

//CREAR UNA NUEVA PELICULA
movieRouter.post("/", MovieController.create);

//actualizar una pelicula
movieRouter.patch("/:id", MovieController.update);


//ELIMINAR UNA PELICULA
movieRouter.delete("/:id", MovieController.deleteMovie);

//PAGINACIÓN
movieRouter.get("/pages", MovieController.paginateMovie);
