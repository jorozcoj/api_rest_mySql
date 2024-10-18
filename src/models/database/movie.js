import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  password: "Luisa9802*",
  database: "movies",
  port: 3306,
};

const connection = await mysql.createConnection(config);

export class MovieModel {
  static async getAll({ genre, title }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase();

      const [filtered] = await connection.query(
        "select BIN_TO_UUID(m.id) id_movie, m.title, m.director,m.duration, m.poster, m.rate, g.name, mg.id_genre from movie m inner join movie_genres mg on m.id=mg.id_movie inner join genre g on g.id = mg.id_genre where g.name = ?;",
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

  static async create({input}) {
    const {
    genre:genreInput,
    title,
    year,
    duration,
    director,
    rate,
    poster
  } = input

  const [uuidResult] = await connection.query('select UUID() uuid;')
  const [{uuid}]= uuidResult


  try {
    await connection.query(
        `insert into movie 
        ( id, title, year, duration, director, rate, poster)
         values (UUID_TO_BIN(?), ? , ?, ?, ?, ?, ?);`,
         [uuid, title, year, duration, director, rate, poster]     
      )
    //nunca permitir que el usuario vea el error
  } catch (error) { 
    throw new Error('Error creating movie') 
  } 
  const [movies] = await connection.query(
    'select title, year, duration, director, rate, poster from movie where id = UUID_TO_BIN(?);',
    [uuid]
  )
  return movies[0]
}

  static async delete({}) {}

  static async update({}) {}
}
