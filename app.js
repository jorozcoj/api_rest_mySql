import express, { json } from "express";
const app = express();
import { movieRouter } from "./src/routes/movies.js";
import { corsMiddleware } from "./src/middlewares/cors.js";

const PORT = process.env.PORT ?? 1234;
app.disable("x-powered-by");
app.use(json());

app.use(corsMiddleware());
app.use('/movies', movieRouter)


//PUERTO EN EL QUE VA A ESCUCHAR
app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});

app.use((req, res) => {
  res.status(404).send("<h1>page not found!</h1>");
});
