import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const data = response.data;
    // console.log(data);
    res.render(__dirname + "/view/index.ejs", {
      activity: data,
    });
  } catch (error) {
    res.render(__dirname + "/view/index.ejs", {
      error: error.message,
    });
    console.log(error);
  }
});

app.post("/submit", async (req, res) => {
  console.log(req.body);
  const { type, participants } = req.body;
  try {
    const response = await axios.get(
      `https://bored-api.appbrewery.com/filter?type=${type}&participants=${participants}`,
    );

    const results = response.data;

    res.render(__dirname + "/view/index.ejs", {
      activity: results[Math.floor(Math.random() * results.length)],
    });
  } catch (error) {
    res.render(__dirname + "/view/index.ejs", {
      error: "No activities match your criteria.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
