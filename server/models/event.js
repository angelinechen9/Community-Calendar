const mongoose = require("mongoose");
const eventSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
})
const Event = mongoose.model("Event", eventSchema);
module.exports = {Event}
