const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
// Create Schema
const RecFrameSchema = new Schema({
  cameraId: {
    type: Number,
    required: true
  },
  startTime: {
    type: Number,
    required: true
  },
  path: {
    type: String,
    required: false
  },
});

module.exports = RecFrame = mongoose.model("recs", RecFrameSchema);