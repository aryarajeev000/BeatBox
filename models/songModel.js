// models/songModel.js

const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    songName: { type: String, required: true },
    description: { type: String },
    songImage: { type: String },
    audioFile: { type: String },
    audioStream: { type: String },
    action: { type: String, enum: ["play", "pause"], default: "pause" },

    // ✅ New field for featured song
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Song", songSchema);
