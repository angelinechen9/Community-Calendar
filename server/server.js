const express = require("express");
const hbs = require("hbs");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
const session = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();
const eventsRoute = require("./routes/eventsRoute.js");
const authRoute = require("./routes/authRoute.js");
const app = express();
app.set("view engine", "hbs");
app.engine("hbs", exphbs({defaultLayout: "main", extname: ".hbs"}));
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));
hbs.registerPartials(path.join(__dirname, "../views", "partials"));
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/CommunityCalendar");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false}
}))
app.use(flash());
app.use((req, res, next) => {
  res.locals.errorMessages = req.flash("errorMessages");
  next();
})
app.get("/", (req, res) => {
  res.render("home.hbs");
})
app.use("/events", eventsRoute);
app.use("/", authRoute);
app.listen(process.env.PORT || 3000);
