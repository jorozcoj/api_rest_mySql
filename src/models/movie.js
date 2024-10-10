import { readJSON } from "../../utils.js";
const moviesList = readJSON('./movies.json')

export class movieModel {
    static getAll({genre, title}) {
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
        
    }
}