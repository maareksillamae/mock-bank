const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionsSchema = new Schema({
  authToken: {
    type: String,
    required: true
  },
  sessionDate: {
    type: Date,
    required: true,
    default: new Date()
  }
});

const Session = mongoose.model("sessions", sessionsSchema);
module.exports = Session;