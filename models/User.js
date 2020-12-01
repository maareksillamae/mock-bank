// Guide: https://medium.com/@alicantorun/build-a-rest-api-with-mongodb-mongoose-and-node-js-3a5afc4a0431
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: [true, 'Firstname is required!'],
    min: 2,
    max: 250
  },
  lastname: {
    type: String,
    required: [true, 'Lastname is required!'],
    min: 2,
    max: 250
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    min: 6,
    max: 512
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
    min: 6,
    max: 250
  },
  registerDate: {
    type: Date,
    required: true,
    default: new Date()
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;