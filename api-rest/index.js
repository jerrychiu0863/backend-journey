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
const token = "ab308c82-6ee0-4b09-a220-f34f9d0c953b";
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.render(__dirname + "/view/index.ejs");
});

app.post("/api-get", async (req, res) => {
  try {
    const secretId = req.body.id;
    const response = await axios.get(
      `https://secrets-api.appbrewery.com/secrets/${secretId}}`,
      config,
    );
    const result = response.data;
    res.render(__dirname + "/view/index.ejs", {
      data: JSON.stringify(result),
    });
  } catch (error) {
    console.log(error.message);
    res.render(__dirname + "/view/index.ejs", {
      error: "No result",
    });
  }
});

app.post("/api-post", async (req, res) => {
  try {
    const response = await axios.post(
      "https://secrets-api.appbrewery.com/secrets",
      {
        secret: req.body.secret,
        score: req.body.score,
      },
      config,
    );
    const result = response.data;
    res.render(__dirname + "/view/index.ejs", {
      data: JSON.stringify(result),
    });
  } catch (error) {
    console.log(error.message);
    res.render(__dirname + "/view/index.ejs", {
      error: "No result",
    });
  }
});

app.post("/api-put", async (req, res) => {
  try {
    const secretId = req.body.id;
    const response = await axios.put(
      `https://secrets-api.appbrewery.com/secrets/${secretId}`,
      {
        secret: req.body.secret,
        score: req.body.score,
      },
      config,
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

app.post("/api-patch", async (req, res) => {
  try {
    const secretId = req.body.id;
    const response = await axios.patch(
      `https://secrets-api.appbrewery.com/secrets/${secretId}`,
      {
        secret: req.body.secret,
        score: req.body.score,
      },
      config,
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

app.post("/api-delete", async (req, res) => {
  try {
    const secretId = req.body.id;
    const response = await axios.delete(
      `https://secrets-api.appbrewery.com/secrets/${secretId}`,
      config,
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
