// Entry point: starts Express and connects to MongoDB
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// If the database is not connected, tell the user clearly instead of hanging
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1)
    return res.status(503).json({ message: "Database not connected. Start MongoDB and restart the backend." });
  next();
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running on port " + (process.env.PORT || 5000))
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection failed:", err.message));
