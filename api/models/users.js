const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullName: { type: String, trim: true, required: true },
  email: { type: String, trim: true, required: true, lowercase: true },
  password: { type: String, trim: true, required: true },
  profileImage: {
    type: String,
    default:
      "https://img.freepik.com/premium-vector/business-global-economy_24877-41082.jpg",
  },
});

const user = mongoose.model("user", userSchema);
module.exports = user;
