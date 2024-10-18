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
      for (let i = 0; i < genreInput.length; i++) {
        const [row]= await connection.query('select id from genre where name = ?;',[genreInput[i]])
        const idGenre = row[0]?.id

        if(!idGenre){
            throw new Error(`Genre not found: ${genreInput[i]}`);
        }
        await connection.query(
            `insert into movie_genres (id_movie, id_genre) values
            (UUID_TO_BIN(?), ?);`,
            [uuid, idGenre]
        )
      }
      
    //nunca permitir que el usuario vea el error
  } catch (error) { 
    console.log('error creating movie', error)
    throw new Error('Error creating movie') 
  } 
  const [movies] = await connection.query(
    'select title, year, duration, director, rate, poster from movie where id = UUID_TO_BIN(?);',
    [uuid]
  )
  return movies[0]
}

  static async delete({id, id_movie}) {
    const [uuidResult] = await connection.query('select UUID() uuid;')
  const [{uuid}]= uuidResult
    if(!id){
        throw new error("el id a eliminar no existe")
    }
    try {
        await connection.query(
            `DELETE FROM movie where id =?;`,[uuid],
            `DELETE FROM movie_genres where id_movie=?;`,[uuid]            
        )
      }        
     catch (error) {
        console.log("La pelicula no pudo ser eliminada", error)
        throw new error ("no pudo ser eliminada")
    }
}  

  static async update({}) {}
}
