const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, enum: ["brand", "creator", "admin"], default: "brand" }
});

module.exports = mongoose.model("User", userSchema);
