import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3001;
let bandname = "";

// Middleware - bodyparser
app.use(bodyParser.urlencoded({ extended: true }));

// Angela solution
const generateBand = (req, res, next) => {
  // bandname = `${req.body["street"]} ${req.body["pet"]}`;
  if (!req.body) {
    next();
  }
  console.log("Line 18");
  console.log(req.body["street"]);
  bandname = req.body["street"];
  // const { street } = req.body;
  // console.log(street);
  // console.log(req.body["street"]);
  next();
};

// app.use(generateBand);

// Middleware - morgon
// app.use(morgan("combined"));

// Middleware - custom
// const logger = (req, res, next) => {
//   console.log("URL:" + req.url);
//   next();
// };
// app.use(logger);

// app.get("/", (req, res) => {
//   console.log(req.rawHeaders);
//   // console.log(req);
//   res.send('<h1 style="font-size:25px; color: red">Hello Express</h1>');
// });

// app.get("/about", (req, res) => {
//   console.log(req.rawHeaders);
//   // console.log(req);
//   res.send(
//     `
//     <div style="display:flex; align-items:center">
//       <h1 style="font-size:25px; color: red">About Express</h1>
//       <p>It's pain</p>
//     </div>
//     `,
//   );
// });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// app.get("/submit", (req, res) => {
//   res.send("submit page");
//   console.log(req.body);
// });

app.post("/submit", generateBand, (req, res) => {
  // console.log(req.rawHeaders);
  // console.log(req);
  // res.redirect("/submit");

  // My solution
  // const { street, pet } = req.body;
  // res.send(`<h1>Band Name</h1> <p>${street}${pet}</p>`);

  res.send(`<h1>Band Name</h1> <p>${bandname}</p>`);
});

// app.post("/register", (req, res) => {
//   // console.log(req.rawHeaders);
//   // console.log(req);
//   res.sendStatus(201);
// });

// app.put("/user/jerry", (req, res) => {
//   // console.log(req.rawHeaders);
//   console.log(req.body);
//   res.sendStatus(200);
// });

// app.patch("/user/jerry", (req, res) => {
//   // console.log(req.rawHeaders);
//   // console.log(req);
//   res.sendStatus(200);
// });

// app.delete("/user/jerry", (req, res) => {
//   // console.log(req.rawHeaders);
//   // console.log(req);
//   res.sendStatus(200);
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
