const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  budgetINR: { type: Number, required: true },
  targetLocations: [{ type: String }], 
  targetAges: {
    type: [Number], 
    validate: [arr => arr.length === 2, "targetAges must be [min, max]"]
  },
  goals: [{ type: String }], 
  tone: [{ type: String }], 
  platforms: [{ type: String }], 
  constraints: {
    noAdultContent: { type: Boolean, default: true },
    timelineDays: { type: Number, required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model("Brand", BrandSchema);