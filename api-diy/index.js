import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/random", (req, res) => {
  const randomNum = Math.floor(Math.random() * jokes.length);
  //The res.json() function sends a JSON response.
  res.json(jokes[randomNum]);
});

app.get("/jokes/:id", (req, res) => {
  const jokeId = parseInt(req.params.id);
  const joke = jokes.find((joke) => joke.id === jokeId);
  res.json(joke);
});

app.get("/filter", (req, res) => {
  const type = req.query.type;
  const filteredJokes = jokes.filter((joke) => joke.jokeType === type);
  res.json(filteredJokes);
});

app.post("/jokes", (req, res) => {
  const { text, type } = req.body;
  const newJoke = {
    id: jokes.length + 1,
    jokeText: text,
    jokeType: type,
  };
  jokes.push(newJoke);
  res.json(newJoke);
});

app.put("/jokes/:id", (req, res) => {
  // My solution
  const { text, type } = req.body;
  const { id } = req.params;
  // const foundJoke = jokes.find((joke) => joke.id === parseInt(id));
  // foundJoke.jokeText = text;
  // foundJoke.jokeType = type;
  // res.json(foundJoke)

  // Angela
  const newJoke = {
    id: id,
    jokeText: text,
    jokeType: type,
  };

  const searchIndex = jokes.findIndex((joke) => joke.id === parseInt(id));
  jokes[searchIndex] = newJoke;
  res.json(newJoke);
});

app.patch("/jokes/:id", (req, res) => {
  const { text, type } = req.body;
  const { id } = req.params;

  // My Solution
  // const searchIndex = jokes.findIndex((joke) => joke.id === parseInt(id));
  // jokes[searchIndex].jokeType = type;
  // res.json(jokes[searchIndex]);

  // Angela
  const existingJoke = jokes.find((joke) => joke.id === parseInt(id));
  const newJoke = {
    id: existingJoke.id,
    jokeText: text || existingJoke.jokeText,
    jokeType: type || existingJoke.jokeType,
  };
  const searchIndex = jokes.findIndex((joke) => joke.id === parseInt(id));
  jokes[searchIndex] = newJoke;
  res.json(newJoke);
});

app.delete("/jokes/:id", (req, res) => {
  const { id } = req.params.id;
  const searchIndex = jokes.findIndex((joke) => joke.id === parseInt(id));
  if (searchIndex > -1) {
    jokes.splice(searchIndex, 1);
    res.sendStatus(200);
  } else {
    res.status(404).json({ error: `Joke with ${id} not found!` });
  }
});

app.delete("/all", (req, res) => {
  const { key } = req.query;
  if (key === masterKey) {
    jokes = [];
    res.sendStatus(200);
  } else {
    res.status(404).json({ error: `You are not authorized!` });
  }
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

let jokes = [
  {
    id: 0,
    jokeText: "Joke 0",
    jokeType: "Funny",
  },
  {
    id: 1,
    jokeText: "Joke 1",
    jokeType: "Movie",
  },
  {
    id: 2,
    jokeText: "Joke 2",
    jokeType: "Movie",
  },
  {
    id: 3,
    jokeText: "Joke 3",
    jokeType: "Movie",
  },
  {
    id: 4,
    jokeText: "Joke 4",
    jokeType: "School",
  },
];
