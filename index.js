// imports
const app = require("./app");
const DatabaseService = require("./services/DbService");

// database connection
DatabaseService.connect(process.env.DATABASE_URL);

// handling exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!! SHUTTING DOWN...");
  console.log(err.name, err.message);
  process.exit(1);
});
// handling rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!! SHUTTING DOWN...");
  console.log(err);
  // console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// listen to port
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`);
});
