const mongoose = require("mongoose");

const signupSchema = mongoose.Schema({
  fullName: { type: String, trim: true, required: true },
  email: { type: String, trim: true, required: true, lowercase: true },
  password: { type: String, trim: true, required: true },
});

const users = mongoose.model("users", signupSchema);
module.exports = users;
