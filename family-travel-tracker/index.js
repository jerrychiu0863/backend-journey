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
// console.log(process.env);
console.log(process.env.NODE_ENV || "development");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// let users = [
//   {
//     id: 1,
//     name: "Jerry",
//     color: "teal",
//   },
//   {
//     id: 2,
//     name: "Bobby",
//     color: "white",
//   },
// ];

// State
let current_user_id = 1;
let error_msg = "";

// Database
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  password: process.env.DB_PASSWORD,
  database: "world",
  post: 5432,
});

db.connect();

async function check_visited_countries(user_id) {
  const result = await db.query(
    "SELECT country_code, user_id FROM visited_countries",
  );
  let countries = [];
  result.rows.forEach((country) => {
    // Match user
    if (country.user_id === user_id) {
      countries.push(country.country_code);
    }
  });
  return countries;
}

async function fetch_users() {
  const result = await db.query("SELECT * FROM users ORDER BY name DESC ");
  return result.rows;
}

app.get("/", async (req, res) => {
  try {
    const countries = await check_visited_countries(current_user_id);
    const users = await fetch_users();
    const color = users.find((user) => user.id === current_user_id).color;
    res.render(__dirname + "/views/index.ejs", {
      visited_countries: countries,
      total: countries.length,
      users: users,
      color: color,
      error: error_msg,
    });
    // db.end();
  } catch (err) {
    console.log(err);
    res.status(500).send("Database error");
  }
});

app.post("/add", async (req, res) => {
  try {
    const { country } = req.body;
    // TODO: check if the country exists
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'",
      [country.toLowerCase()],
    );
    const code = result.rows[0].country_code;
    try {
      // TODO: check if the country is alread in the DB
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES($1, $2)",
        [code, current_user_id],
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
      error_msg = "Country has been added!";
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    error_msg = "Country does not exist!";
    res.redirect("/");
  }
});

app.post("/user", async (req, res) => {
  if (req.body.name) {
    const id = parseInt(req.body.name);
    // const users = await fetch_users();
    // current_user_id = users.find((user) => user.id === id).id;
    current_user_id = id;
    res.redirect("/");
  }
  if (req.body.add) {
    res.render(__dirname + "/views/add.ejs");
  }
});

app.post("/new", async (req, res) => {
  const { name, color } = req.body;
  if (!name || !color) {
    return res.render(__dirname + "/views/add.ejs", {
      error: "Please enter a name and pick a color!",
    });
  }
  try {
    // Add new user and return the latest user
    const result = await db.query(
      "INSERT INTO users(name, color) VALUES($1, $2) RETURNING *",
      [name, color],
    );

    //
    current_user_id = result.rows[0].id;

    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
