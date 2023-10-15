const express = require("express");
const hbs = require("hbs");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
require("dotenv").config({
  path: path.resolve(__dirname, "src/config", ".env"),
});
require("./src/db/connection");
require("./src/utils/hbsHelper");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON payloads in the request body
app.use(express.json());

// Middleware to parse incoming URL-encoded form data in the request body
// The { extended: true } option allows for nested objects and arrays to be parsed
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(async (req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  // res.locals.user = req.user;
  next();
});

// Setup hbs as template engine
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "src", "views", "partials"));

// Setup static files
app.use(express.static(path.join(__dirname, "src", "public")));

// Setup views
app.set("views", path.join(__dirname, "src", "views"));

// Setup routes
const routes = require("./src/routes");
app.use("/", routes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
