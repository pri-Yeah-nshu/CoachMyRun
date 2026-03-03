const Run = require("../models/runModel.js");
const { getDistance } = require("../utils/getDistance.js");

exports.socketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("join-run", (runId) => {
      socket.join(runId);
      console.log(`Socket ${socket.id} joined run ${runId}`);
    });
    console.log(`a user connected... ${socket.id}`);
    socket.emit("welcome", `welcome to the server ${socket.id}`);
    socket.on("positions", async (data) => {
      try {
        const { runId, latitude, longitude } = data;
        const run = await Run.findById(runId);
        if (!run) return;
        if (run.route.length === 0) {
          run.route.push({
            lat: latitude,
            lng: longitude,
            timestamp: new Date(),
          });
          await run.save();
          io.to(runId).emit("receive-location", data);
        } else {
          const last = run.route[run.route.length - 1];

          const distance = getDistance(last.lat, last.lng, latitude, longitude);

          if (distance >= 10) {
            run.route.push({
              lat: latitude,
              lng: longitude,
              timestamp: new Date(),
            });
            run.distance += distance;
            await run.save();
            io.to(runId).emit("receive-location", data);
          }
        }
      } catch (err) {
        console.log(err);
      }
    });
  });
};

// exports.socketHandler = (io) => {
//   io.on("connection", (socket) => {
//     socket.on("join-run", (runId) => {
//       socket.join(runId);
//     });

//     socket.on("send-location", async (data) => {
//       const { runId, latitude, longitude } = data;

//       const run = await Run.findById(runId);
//       if (!run) return;

//       if (run.route.length === 0) {
//         run.route.push({ latitude, longitude, timestamp: new Date() });
//         await run.save();
//       } else {
//         const last = run.route[run.route.length - 1];

//         const distance = getDistance(
//           last.latitude,
//           last.longitude,
//           latitude,
//           longitude,
//         );

//         if (distance >= 10) {
//           run.route.push({ latitude, longitude, timestamp: new Date() });
//           run.distance += distance;
//           await run.save();
//         }
//       }

//       io.to(runId).emit("receive-location", data);
//     });
//   });
// };

// updating Location via Socket.IO instead of REST API as it is more efficient for real-time updates
// and
// reduces server load by eliminating the need for multiple HTTP requests.
