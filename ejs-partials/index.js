import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render(__dirname + "/view/index.ejs");
});

app.get("/about", (req, res) => {
  res.render(__dirname + "/view/about.ejs");
});

app.get("/contact", (req, res) => {
  res.render(__dirname + "/view/contact.ejs");
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
