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

    static async update({id, input}){
      const movieIndex = moviesList.findIndex(movie => movie.id === id);
      if (movieIndex === -1) return false
     
        moviesList[movieIndex]={
          ...moviesList[movieIndex],
        ...input
      }
      return moviesList[movieIndex]             
    }

}