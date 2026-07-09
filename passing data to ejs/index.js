import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render(__dirname + "/view/index.ejs");
});

app.post("/submit", (req, res) => {
  // const name = req.body;
  const { fName, lName } = req.body;
  res.render(__dirname + "/view/index.ejs", {
    name: fName + lName,
  });
  // res.redirect("/");
  // res.send({
  //   name: req.body["fName"] + req.body["lName"],
  // });

  console.log(req.body);
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
