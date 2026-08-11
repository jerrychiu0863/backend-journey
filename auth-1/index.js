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
  database: "secrets",
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

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  // console.log(`Username: ${username};Password:${password}`);
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      username,
    ]);
    if (checkResult.rows.length > 0) {
      return res.send("Email has been registered! Try log in!");
    }
    const result = await db.query(
      "INSERT INTO users(email, password) VALUES($1, $2) RETURNING *",
      [username, password],
    );
    console.log(result);
    res.render(__dirname + "/views/secret.ejs");
  } catch (err) {
    console.log(err);
    res.send("Server Error!");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // console.log(`Username: ${username};Password:${password}`);
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      username,
    ]);
    // Check if user exists
    if (result.rows.length !== 0) {
      const user = result.rows[0];
      // Check if password matches
      if (user.password === password) {
        return res.render(__dirname + "/views/secret.ejs");
      }
      return res.send("Wrong password!");
    } else {
      return res.send("Email not registered!");
    }
  } catch (err) {
    console.log(err);
    res.send("Server Error!");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
