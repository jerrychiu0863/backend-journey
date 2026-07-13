import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

const username = "m0863";
const password = "1786";
const api_key = "99c74765-42aa-416d-b84a-d4cfef4e602e";
const token = "1dbfe071-371e-444a-9dcf-2c09e4d54ffa";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://secrets-api.appbrewery.com/random",
    );
    const result = response.data;
    res.render(__dirname + "/view/index.ejs", {
      data: JSON.stringify(result),
    });
  } catch (error) {
    res.render(__dirname + "/view/index.ejs", {
      error: "No result",
    });
  }
});

app.get("/basic-auth", async (req, res) => {
  try {
    const response = await axios.get(
      "https://secrets-api.appbrewery.com/all?page=1",
      {
        auth: {
          username,
          password,
        },
      },
    );
    const result = response.data;
    res.render(__dirname + "/view/index.ejs", {
      data: JSON.stringify(result[Math.floor(Math.random() * result.length)]),
    });
  } catch (error) {
    res.render(__dirname + "/view/index.ejs", {
      error: "No result",
    });
  }
});

app.get("/api-key", async (req, res) => {
  try {
    const response = await axios.get(
      `https://secrets-api.appbrewery.com/filter?score=7&apiKey=${api_key}`,
    );
    const result = response.data;
    res.render(__dirname + "/view/index.ejs", {
      data: JSON.stringify(result[Math.floor(Math.random() * result.length)]),
    });
  } catch (error) {
    res.render(__dirname + "/view/index.ejs", {
      error: "No result",
    });
  }
});

app.get("/token", async (req, res) => {
  try {
    const response = await axios.get(
      "https://secrets-api.appbrewery.com/secrets/2",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const result = response.data;
    res.render(__dirname + "/view/index.ejs", {
      data: JSON.stringify(result),
    });
  } catch (error) {
    res.render(__dirname + "/view/index.ejs", {
      error: "No result",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
