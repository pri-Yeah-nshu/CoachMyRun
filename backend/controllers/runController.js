const User = require("../models/userModel");
const Run = require("../models/runModel");
const { getDistance } = require("../utils/getDistance");
const jwt = require("jsonwebtoken");
// GET RUN HISTORY

exports.getRunHistory = async (req, res) => {
  try {
    // const userId = req.user._id;  I HAVE TO CHANGE IT
    const token = req.cookies.token;
    const userId = jwt.verify(token, process.env.JWT_SECRET).id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const runs = await Run.find({ userId }).sort({ date: -1 });
    res.status(200).json({
      status: "success",
      data: {
        runs,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

// GET RUN BY ID

exports.getRunById = async (req, res) => {
  try {
    const runId = req.params.id;
    const run = await Run.findById(runId);
    if (!run) {
      return res.status(404).json({
        status: "fail",
        message: "Run not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        run,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

// START NEW RUN

exports.startNewRun = async (req, res) => {
  try {
    const userId = req.user._id;
    // const { startLocation } = req.body; will get this through socket.io

    const unfinishedRun = await Run.findOne({
      userId,
      status: { $in: ["in progress", "paused"] },
    });

    if (unfinishedRun) {
      return res.status(400).json({
        status: "fail",
        message: "Firstly finish your previous run!",
      });
    }

    const newRun = await Run.create({
      userId,
      // route: [startLocation],   // ✅ correct way
      startTime: Date.now(),
      status: "in progress",
    });

    res.status(201).json({
      status: "success",
      data: { run: newRun },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

// PAUSE RUN

exports.pauseRun = async (req, res) => {
  try {
    const runId = req.params.id;
    const run = await Run.findById(runId);
    if (!run) {
      return res.status(404).json({
        status: "fail",
        message: "Run not found",
      });
    }
    if (run.status !== "in progress") {
      return res.status(400).json({
        status: "fail",
        message: "Only runs in progress can be paused",
      });
    }
    const updatedRun = await Run.findByIdAndUpdate(
      runId,
      {
        $set: { status: "paused", startPausedTime: Date.now() },
        $inc: { numberOfPauses: 1 }, // Assuming you want to increment by 1
      },
      { new: true }, // Return the updated document
    );

    res.status(200).json({
      status: "success",
      data: {
        run: updatedRun,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

// END RUN

exports.endRun = async (req, res) => {
  try {
    const runId = req.params.id;
    const run = await Run.findById(runId);
    if (!run) {
      return res.status(404).json({
        status: "fail",
        message: "Run not found",
      });
    }
    if (run.status !== "in progress" && run.status !== "paused") {
      return res.status(400).json({
        status: "fail",
        message: "Only runs in progress or paused can be ended",
      });
    }
    let totalPausedTime = run.pausedTime;
    if (run.status === "paused") {
      const pausedTime =
        run.pausedTime + (Date.now() - run.startPausedTime) / 1000;
      totalPausedTime += pausedTime;
    }
    const elapsedTime = (Date.now() - run.startTime) / 1000; // in seconds
    const duration = elapsedTime - totalPausedTime;
    const caloriesBurned = (elapsedTime / 60000) * 72;
    const updatedRun = await Run.findByIdAndUpdate(
      runId,
      {
        $set: {
          status: "end",
          elapsedTime,
          endTime: Date.now(),
          caloriesBurned,
          duration,
        },
      },
      { new: true },
    );
    res.status(200).json({
      status: "success",
      data: {
        run: updatedRun,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

// RESUME RUN

exports.resumeRun = async (req, res) => {
  try {
    const runId = req.params.id;
    const run = await Run.findById(runId);
    if (!run) {
      return res.status(404).json({
        status: "fail",
        message: "Run not found",
      });
    }
    if (run.status !== "paused") {
      return res.status(400).json({
        status: "fail",
        message: "Only paused runs can be resumed",
      });
    }
    const totalPausedTime =
      run.pausedTime + (Date.now() - run.startPausedTime) / 1000;
    const updatedRun = await Run.findByIdAndUpdate(
      runId,
      {
        $set: {
          status: "in progress",
          pausedTime: totalPausedTime,
        },
      },
      { new: true },
    );
    res.status(200).json({
      status: "success",
      data: {
        run: updatedRun,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

// LOCATION UPDATE

exports.locationUpdate = async (req, res) => {
  try {
    const runId = req.params.id;
    if (!runId) {
      return res.status(400).json({
        status: "fail",
        message: "Run ID, latitude and longitude are required",
      });
    }
    const { latitude, longitude } = req.body;
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        status: "fail",
        message: "Run ID, latitude and longitude are required",
      });
    }
    // if run is just started and has no route, push the first location as start location
    const run = await Run.findById(runId);
    if (run.route.length === 0) {
      await Run.findByIdAndUpdate(runId, {
        $push: {
          route: {
            lat: latitude,
            lng: longitude,
            timestamp: new Date(),
          },
        },
      });
      return res.status(200).json({
        status: "success",
        data: {
          run,
        },
      });
    }
    const lastLocation = run.route[run.route.length - 1];
    const dist = getDistance(
      lastLocation.lat,
      lastLocation.lng,
      latitude,
      longitude,
    );
    if (dist < 5) {
      return res.status(200).json({
        status: "success",
        message:
          "Location update received but not added to route as distance is less than 5 meters",
      });
    }

    if (dist >= 10) {
      const updatedRun = await Run.findByIdAndUpdate(
        runId,
        {
          $push: { route: { lat: latitude, lng: longitude } },
          $inc: { distance: dist },
        },
        { new: true },
      );
      res.status(200).json({
        status: "success",
        data: {
          run: updatedRun,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
