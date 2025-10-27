require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./db");
const authRoutes = require("./routes/authRoutes");
const songRoutes = require("./routes/songRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect Database
connectDB();
// ✅ invalid JSON handler (place right after express.json)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send("Invalid JSON format");
  }
  next();
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);

app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
