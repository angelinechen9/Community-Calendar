const express = require("express");
const hbs = require("hbs");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const _ = require("lodash");
const {Event} = require("./models/event.js");
const app = express();
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));
hbs.registerPartials(path.join(__dirname, "../views", "partials"));
mongoose.connect("mongodb://localhost:27017/CommunityCalendar");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.get("/", (req, res) => {
  res.redirect("/events");
})
app.get("/events", (req, res) => {
  Event.find()
  .then(events => {
    res.render("index.hbs", {
      events
    });
  })
  .catch(e => {
    res.status(404).send(e);
  })
})
app.get("/events/new", (req, res) => {
  res.render("new.hbs");
})
app.post("/events", (req, res) => {
  const event = new Event({
    title: req.body.title,
    description: req.body.description
  })
  event.save()
  .then(event => {
    res.redirect("/events");
  })
  .catch(e => {
    res.status(404).send(e);
  })
})
app.get("/events/:id", (req, res) => {
  Event.find({_id: req.params.id})
  .then(event => {
    res.render("show.hbs", {
      id: event[0]._id,
      title: event[0].title,
      description: event[0].description
    });
  })
  .catch(e => {
    res.status(404).send(e);
  })
})
app.get("/events/:id/edit", (req, res) => {
  Event.find({_id: req.params.id})
  .then(event => {
    res.render("edit.hbs", {
      id: event[0]._id,
      title: event[0].title,
      description: event[0].description
    });
  })
  .catch(e => {
    res.status(404).send(e);
  })
})
app.put("/events/:id", (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ["title", "description"]);
  Event.findByIdAndUpdate(id, {$set: body}, {new: true})
  .then(event => {
    res.redirect("/events");
  })
  .catch(e => {
    res.status(404).send(e);
  })
})
app.delete("/events/:id", (req, res) => {
  const id = req.params.id;
  Event.findByIdAndRemove(id)
  .then(event => {
    res.redirect("/events");
  })
  .catch(e => {
    res.status(404).send(e);
  })
})
app.listen(3000);
