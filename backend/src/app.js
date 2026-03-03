const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const authRouter = require("../routes/authRoutes");
const runRouter = require("../routes/runRoutes");
const cookie_parser = require("cookie-parser");
const socketio = require("socket.io");
const { socketHandler } = require("../socket/socketHandler");
const cors = require("cors");
const app = express();

dotenv.config({ path: "./config.env" });
const server = http.createServer(app);
const io = new socketio.Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.use(express.json());
//want to allow access to everyone for now, will change it later
app.use(cookie_parser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.set("view engine", "ejs");
app.set(express.static("public"));
//Routes
app.use("/api/v1/run", runRouter);
app.use("/api/v1/auth", authRouter);

socketHandler(io);

app.get("/", (req, res) => {
  res.send("1st Step done");
});

module.exports = server;
