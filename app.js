// imports
const express = require("express"); //importing express package
const app = express(); // creates a express application
const dotenv = require("dotenv").config(); //this allows me to use my .env values in this file
const morgan = require("morgan");
const cors = require("cors");

// Routes Import
const authRoutes = require("./routes/auth.routes");
const venueRoutes = require("./routes/venues.routes");
const bookRoutes = require('./routes/book.routes')
const challengeRoutes = require("./routes/challengeRoutes")
const profileRoutes = require("./routes/profile.routes")
const notificationRoutes = require("./routes/notification.routes")

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/auth", authRoutes);
app.use("/venues", venueRoutes);
app.use('/booking', bookRoutes)
app.use("/challenges", challengeRoutes)
app.use("/profile", profileRoutes)
app.use("/notifications", notificationRoutes)
module.exports = app;
