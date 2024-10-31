import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
<<<<<<< HEAD
  password: "",
=======
  password: "12345678",
>>>>>>> e29f10472d338842863177fd7cf26acb6fddaa3b
  database: "movies",
  port: 3306,
};

const connection = await mysql.createConnection(config);

export class MovieModel {
  static async getAll({ genre, title }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase();

      const [filtered] = await connection.query(
        "select BIN_TO_UUID(m.id) id_movie, m.title, m.director,m.duration, m.poster, m.rate, g.name, mg.id_genre from movie m inner join movie_genres mg on m.id=mg.id_movie inner join genre g on g.id = mg.id_genre where lower(g.name) = ?;",
        [lowerCaseGenre]
      );
      return filtered;
    } else if (title) {
      const titleToLower = title.toLowerCase();
      const [filtered] = await connection.query(
        "select BIN_TO_UUID(id) id,  title, director, duration, poster, rate from movie where lower(title) = ?;",
        [titleToLower]
      );
      return filtered;
    }

    const [movies] = await connection.query(
      "select BIN_TO_UUID(id) id, title, director, duration,rate, poster from movie"
    );
    return movies;
  }

  static async getById({ id }) {
    if (id) {
      const [movieById] = await connection.query(
        "select BIN_TO_UUID(id) id, title, director, duration,rate, poster from movie where BIN_TO_UUID(id) =?;",
        [id]
      );
      return movieById;
    }
  }

  static async create({ input }) {
    const {
      genre: genreInput,
      title,
      year,
      duration,
      director,
      rate,
      poster,
    } = input;

    const [uuidResult] = await connection.query("select UUID() uuid;");
    const [{ uuid }] = uuidResult;

    try {
      await connection.query(
        `insert into movie 
        ( id, title, year, duration, director, rate, poster)
         values (UUID_TO_BIN(?), ? , ?, ?, ?, ?, ?);`,
        [uuid, title, year, duration, director, rate, poster]
      );
      for (let i = 0; i < genreInput.length; i++) {
        const [row] = await connection.query(
          "select id from genre where name = ?;",
          [genreInput[i]]
        );
        const idGenre = row[0]?.id;

        if (!idGenre) {
          throw new Error(`Genre not found: ${genreInput[i]}`);
        }
        await connection.query(
          `insert into movie_genres (id_movie, id_genre) values
            (UUID_TO_BIN(?), ?);`,
          [uuid, idGenre]
        );
      }

      //nunca permitir que el usuario vea el error
    } catch (error) {
      console.log("error creating movie", error);
      throw new Error("Error creating movie");
    }
    const [movies] = await connection.query(
      "select title, year, duration, director, rate, poster from movie where id = UUID_TO_BIN(?);",
      [uuid]
    );
    return movies[0];
  }

  static async delete({ id }) {
    const [uuidResult] = await connection.query("select UUID() uuid;");
    const [{ uuid }] = uuidResult;
    if (!id) {
      throw new Error("Insert a correct Id");
    }
    try {
      await connection.query(
        `DELETE FROM movie where id =?;`,
        [uuid],
        `DELETE FROM movie_genres where id_movie=?;`,
        [uuid]
      );
    } catch (error) {
      console.log("The movie couldn't be deleted", error);
      throw new Error("The movie couldn't be deleted");
    }
  }

  static async update({ id, input }) {
    if (!id) {
      throw new Error("Insert a correct Id");
    }
  
    // Verify if movie exists
    const [movies] = await connection.query(
      `SELECT * FROM movie WHERE id = UUID_TO_BIN(?);`,
      [id]
    );
  
    if (movies.length === 0) {
      throw new Error("Movie not found");
    }
  
    // built the query for automatic update
    const fields = [];
    const values = [];
  
    for (const [key, value] of Object.entries(input)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  
    // Add ID for condition WHERE
    values.push(id);
  
    try {
      // update the movie
      await connection.query(
        `UPDATE movie SET ${fields.join(", ")} WHERE id = UUID_TO_BIN(?);`,
        values
      );
  
      // Retornar la película actualizada
      const [updatedMovie] = await connection.query(
        `SELECT title, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?);`,
        [id]
      );
  
      return updatedMovie[0];
    } catch (error) {
      console.log("The movie couldn't be updated", error);
      throw new Error("The movie couldn't be updated");
    }
  }
  
}
