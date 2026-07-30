import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  password: "",
  database: "",
  post: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// async function checkVisited() {
//   const result = await db.query("SELECT country_code FROM visited_country");
//   let countries = [];
//   result.rows.forEach((row) => {
//     countries.push(row.country_code);
//   });
//   return countries;
// }

app.get("/", async (req, res) => {});

app.post("/add", async (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
