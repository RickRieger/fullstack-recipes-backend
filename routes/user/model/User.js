const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  userName: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  friends: [{ type: mongoose.Schema.ObjectId, ref:"friend"}],

  recipes: [{ type: mongoose.Schema.ObjectId, ref:"recipe"}],

  grocery: [{ type: mongoose.Schema.ObjectId, ref:"grocery"}],
});

module.exports = mongoose.model("user", userSchema);
