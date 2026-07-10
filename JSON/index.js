import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
const recipeJSON =
  '[{"id":"01", "name":"Chicken Taco"},{"id":"02", "name":"Beef Taco"}]';

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render(__dirname + "/view/index.ejs");
});

app.post("/recipe", (req, res) => {
  const data = JSON.parse(recipeJSON).find((recipe) => {
    return recipe.name.includes(req.body.choice);
  });
  res.render(__dirname + "/view/index.ejs", { recipe: data });
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
