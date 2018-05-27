const express = require("express");
const _ = require("lodash");
const eventsRoute = express.Router();
const {Event} = require("../models/event.js");
const {validateUser} = require("../middleware/middleware.js");
eventsRoute.get("/", validateUser, (req, res) => {
  Event.find()
  .then(events => {
    res.render("index.hbs", {
      myEvents: events.filter(event => event.userId === req.session.userId),
      allEvents: events
    });
  })
  .catch(e => {
    res.status(404).send(e);
  })
})
eventsRoute.get("/new", validateUser, (req, res) => {
  res.render("new.hbs");
})
eventsRoute.post("/", validateUser, (req, res) => {
  const event = new Event({
    title: req.body.title,
    description: req.body.description,
    userId: req.session.userId
  })
  event.save()
  .then(event => {
    res.redirect("/events");
  })
  .catch(e => {
    res.status(404).send(e);
  })
})
eventsRoute.get("/:id", validateUser, (req, res) => {
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
eventsRoute.get("/:id/edit", validateUser, (req, res) => {
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
eventsRoute.put("/:id", validateUser, (req, res) => {
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
eventsRoute.delete("/:id", validateUser, (req, res) => {
  const id = req.params.id;
  Event.findByIdAndRemove(id)
  .then(event => {
    res.redirect("/events");
  })
  .catch(e => {
    res.status(404).send(e);
  })
})
module.exports = eventsRoute
