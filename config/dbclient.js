import mysql from "mysql2/promise";
import { config } from "dotenv";

config()

const dbClient = {
    host: "localhost",
    user: "root",
    password: process.env.PASSWORD,
    database: "movies",
    port: 3306,
};

const connection = await mysql.createConnection(dbClient)

export default connection;