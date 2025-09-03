const mongoose = require("mongoose");

const CreatorSchema = new mongoose.Schema({
  handle: String,
  verticals: [String],
  platforms: [String],
  audienceGeo: Object,
  audienceAge: Object,
  avgViews: Number,
  engagementRate: Number,
  pastBrandCategories: [String],
  contentTone: [String],
  safetyFlags: {
    adult: Boolean,
    controversial: Boolean,
  },
  basePriceINR: Number,
});

module.exports = mongoose.model("Creator", CreatorSchema);