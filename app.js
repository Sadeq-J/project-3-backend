// imports
const express = require("express"); //importing express package
const path = require("path");
const app = express(); // creates a express application
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });

const morgan = require("morgan");
const cors = require("cors");

// Routes Import
const authRoutes = require("./routes/auth.routes");
const venueRoutes = require("./routes/venues.routes");
const bookRoutes = require('./routes/book.routes')
const challengeRoutes = require("./routes/challengeRoutes")
const profileRoutes = require("./routes/profile.routes")
const notificationRoutes = require("./routes/notification.routes")
const adminRoutes = require("./routes/admin.routes")

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/auth", authRoutes);
app.use("/venues", venueRoutes);
app.use('/booking', bookRoutes)
app.use("/challenges", challengeRoutes)
app.use("/profile", profileRoutes)
app.use("/notifications", notificationRoutes)
app.use("/admin", adminRoutes)

app.use((req, res, next) => {
  console.log(`📥 Incoming ${req.method} request to ${req.originalUrl}`);
  next();
});

app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR CAUGHT:", err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: "Server error occurred during file upload or processing",
    error: err.message,
    stack: err.stack,
  });
});


module.exports = app;
