import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
let auth = false;

// Middleward
app.use(express.urlencoded({ extended: true }));

function passwordCheck(req, res, next) {
  const password = req.body["password"];
  if (password === "ILoveProgramming") {
    auth = true;
  }
  next();
}

// app.use(passwordCheck);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/check", passwordCheck, (req, res) => {
  // if (req.body.password === "ILoveProgromming") {
  //   res.sendFile(__dirname + "/public/secret.html");
  // }
  if (auth) {
    res.sendFile(__dirname + "/public/secret.html");
  } else {
    res.redirect("/");
    // res.sendFile(__dirname + "/public/index.html");
  }
  // console.log(req.body);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
