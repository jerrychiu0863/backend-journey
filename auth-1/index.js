import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Database
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  password: process.env.DB_PASSWORD,
  database: "world",
  post: 5432,
});

db.connect();

app.get("/", (req, res) => {
  res.render(__dirname + "/views/index.ejs");
});

app.get("/login", (req, res) => {
  res.render(__dirname + "/views/login.ejs");
});

app.get("/register", (req, res) => {
  res.render(__dirname + "/views/register.ejs");
});

app.post("/register", (req, res) => {
  console.log(req.body);
});

app.post("/login", (req, res) => {
  console.log(req.body);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
