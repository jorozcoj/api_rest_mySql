import { readJSON } from "../../utils.js";
const moviesList = readJSON('./movies.json')
import { randomUUID } from "node:crypto";

export class MovieModel {
    static async getAll ({genre, title}) {
        if (genre) {
            const filteredMovie = moviesList.filter((movie) =>
              movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
            );        
            return filteredMovie;
            
          } else if (title) {
            const filteredMovie = moviesList.filter(
              (movie) => movie.title.toLowerCase() === title.toLowerCase()
            );
        
            return filteredMovie;
          }
        return moviesList
    }

    static async getById({id}){
      const movie = moviesList.find(movie => movie.id === id);
      return movie;

    }

    static async createMovie(input){
      const newMovie = {
        id: randomUUID(),
        ...input,
      };
    
      moviesList.push(newMovie);

      return newMovie
    }

    static async deleteMovie({id}){
      const movieIndex = moviesList.findIndex(movie => movie.id === id);
      if (movieIndex === -1) return false
      moviesList.splice(movieIndex, 1);
      return true
    }

    static async update({ id, input }) {
      if (!id) {
        throw new Error("Insert a correct Id");
      }
    
      // Verificar si la película existe
      const [movies] = await connection.query(
        `SELECT * FROM movie WHERE id = UUID_TO_BIN(?);`,
        [id]
      );
    
      if (movies.length === 0) {
        throw new Error("Movie not found");
      }
    
      const fields = [];
      const values = [];
    
      for (const [key, value] of Object.entries(input)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    
      // Agregar el ID para la condición WHERE
      values.push(id);
    
      try {
        // Actualizar la película
        await connection.query(
          `UPDATE movie SET ${fields.join(", ")} WHERE id = UUID_TO_BIN(?);`,
          values
        );
    
        // Retornar la película actualizada
        const [updatedMovie] = await connection.query(
          `SELECT * FROM movie WHERE id = UUID_TO_BIN(?);`,
          [id]
        );
    
        return updatedMovie[0];
      } catch (error) {
        console.log("The movie couldn't be updated", error);
        throw new Error("The movie couldn't be updated");
      }
    }

}