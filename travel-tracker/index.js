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

// Database
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  password: process.env.DB_PASSWORD,
  database: "world",
  post: 5432,
});

db.connect();

// async function checkVisited() {
//   const result = await db.query("SELECT country_code FROM visited_country");
//   let countries = [];
//   result.rows.forEach((row) => {
//     countries.push(row.country_code);
//   });
//   return countries;
// }

async function check_visited_countries() {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

app.get("/", async (req, res) => {
  try {
    // const result = await db.query("SELECT country_code FROM visited_countries");
    // let countries = [];
    // result.rows.forEach((country) => {
    //   countries.push(country.country_code);
    // });
    const countries = await check_visited_countries();
    res.render(__dirname + "/views/index.ejs", {
      visited_countries: countries,
      total: countries.length,
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
        "INSERT INTO visited_countries (country_code) VALUES($1)",
        [code],
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
      const countries = await check_visited_countries();
      res.render(__dirname + "/views/index.ejs", {
        visited_countries: countries,
        total: countries.length,
        error: "Country has been added!",
      });
    }
  } catch (err) {
    console.log(err);
    const countries = await check_visited_countries();
    res.render(__dirname + "/views/index.ejs", {
      visited_countries: countries,
      total: countries.length,
      error: "Country does not exist!",
    });
  }
});

app.post("/add", async (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
