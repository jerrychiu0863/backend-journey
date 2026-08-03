import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

dotenv.config();

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: process.env.DB_PASSWORD,
  port: 5432,
});

db.connect();

let quiz = [
  { country: "France", capital: "Paris" },
  { country: "Taiwan", capital: "Taipei" },
  { country: "Luxembourg", capital: "Luxembourg" },
  { country: "Netherlands", capital: "Amsterdam" },
];

db.query("SELECT * FROM capitals", (err, res) => {
  if (err) {
    console.log("Error excuting query", err.stack);
  } else {
    quiz = res.rows;
  }
  db.end();
});

let totalCorrect = 0;
let currentQuestion = {};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  totalCorrect = 0;
  nextQuestion();
  res.render(__dirname + "/view/index.ejs", {
    question: currentQuestion,
  });
});

app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    isCorrect = true;
  }
  nextQuestion();
  res.render(__dirname + "/view/index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
