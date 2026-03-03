const server = require("./src/app");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
// Connect to MongoDB
const DB = process.env.DATABASE_URL.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected to Database successfully! :)");
  })
  .catch((err) => {
    console.error("Database connection error:");
    console.error(err.message);
  });

server.listen(port, () => {
  console.log(`Server Running at port ${port}...`);
});
