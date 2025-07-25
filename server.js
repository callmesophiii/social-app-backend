import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./config/connection.js";
import usersRouter from './routes/users.js'
import postsRouter from './routes/posts.js'
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(morgan('dev'));
const PROD_URL = process.env.PROD_URL;

const whitelist = ["http://localhost:3000", PROD_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/users', usersRouter)
app.use('/api/posts', postsRouter)
db.once("open", () => {
  app.listen(PORT, () => console.log(`:earth_africa: Now listening on localhost:${PORT}`));
});
