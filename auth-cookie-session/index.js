import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import bycrypt, { hash } from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const saltRounds = 5;

dotenv.config();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// Middleware-session(order matters)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// Database
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  post: process.env.DB_PORT,
});

db.connect();

let current_user = "";

app.get("/", (req, res) => {
  console.log(req.user);
  res.render(__dirname + "/views/index.ejs");
});

app.get("/login", (req, res) => {
  res.render(__dirname + "/views/login.ejs");
});

app.get("/register", (req, res) => {
  res.render(__dirname + "/views/register.ejs");
});

app.get("/secret", (req, res) => {
  // console.log(req.user);
  // Passport - Check if user is authenticated
  if (req.isAuthenticated()) {
    return res.render(__dirname + "/views/secret.ejs");
  }
  res.redirect("/login");
});

// Google Login
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/secret",
    failureRedirect: "/login",
  }),
);

// Logout
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  // console.log(`Username: ${username};Password:${password}`);
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      username,
    ]);
    if (checkResult.rows.length > 0) {
      return res.send("Email has been registered! Try log in!");
    }

    bycrypt.hash(password, saltRounds, async (err, hash) => {
      const result = await db.query(
        "INSERT INTO users(email, password) VALUES($1, $2) RETURNING *",
        [username, hash],
      );
      const user = result.rows[0];
      // Passport
      req.login(user, (err) => {
        console.log(err);
        res.redirect("/secret");
      });
    });
  } catch (err) {
    console.log(err);
    res.send("Server Error!");
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login",
  }),
);

passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [
        username,
      ]);
      // Check if user exists
      if (result.rows.length !== 0) {
        const user = result.rows[0];
        const savedHashPassword = user.password;
        // Check if password matches
        bycrypt.compare(password, savedHashPassword, (err, result) => {
          if (err) {
            return cb(err);
          } else {
            if (result) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      return cb(err);
    }
  }),
);
// console.log(process.env.GOOGLE_CLIENT_ID);
// Google oauth2
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessTokey, refreshToken, profile, cb) => {
      console.log(profile);
      // Save user info in database
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          profile.email,
        ]);
        if (result.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",
            [profile.email, "google"],
          );
          cb(null, newUser.rows[0]);
        } else {
          // User exsits
          cb(null, result.rows[0]);
        }
      } catch (err) {
        cb(err);
      }
    },
  ),
);

// Save user data in localstorage
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
