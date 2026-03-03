const mongoose = require("mongoose");

const runSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    distance: {
      type: Number,
      required: false,
      default: 0,
    },
    duration: {
      type: Number,
      required: false,
      default: 0,
    },
    pausedTime: {
      type: Number,
      default: 0,
    },
    startPausedTime: {
      type: Date,
    },
    elapsedTime: {
      type: Number,
      required: false,
      default: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    image: [
      {
        type: String,
        required: false,
      },
    ],
    status: {
      type: String,
      lowercase: true,
      enum: ["end", "in progress", "paused"],
      default: "in progress",
    },
    route: [
      {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    caloriesBurned: {
      type: Number,
      required: false,
    },
    aiFeedback: {
      type: String,
      required: false,
    },
    experience: {
      type: String,
      enum: ["Hard", "Moderate", "Easy"],
      default: "Moderate",
    },
    numberOfPauses: {
      type: Number,
      default: 0,
    },
    startTime: {
      type: Date,
      required: false,
      default: Date.now(),
    },
    endTime: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);
runSchema.index({ userId: 1, date: -1 });
const Run = mongoose.model("Run", runSchema);

module.exports = Run;
