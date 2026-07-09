import express from "express";
import generateName from "sillyname";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render(__dirname + "/view/index.ejs");
});

app.post("/submit", (req, res) => {
  const bandName = generateName();
  res.render(__dirname + "/view/index.ejs", {
    bandName,
  });
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
