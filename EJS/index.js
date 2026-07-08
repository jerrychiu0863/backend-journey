import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

const date = new Date();
const day = date.getDay();

// day % 6 ==0  ?'weekend' : 'weekday'
// console.log(day % 6);

// app.get("/", (req, res) => {
//   res.render(__dirname + "/view/index.ejs", {
//     dataType: `${day % 6 === 0 ? "weekend" : "weekday"}`,
//     advice: `time to ${day % 6 === 0 ? "have fun" : "work"}`,
//   });
// });

app.get("/", (req, res) => {
  const data = {
    title: "EJS tags",
    second: new Date().getSeconds(),
    items: ["Apple", "Banana", "Cherry"],
    htmlContent: "<em>This is em content</em>",
  };
  res.render(__dirname + "/view/index.ejs", data);
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
