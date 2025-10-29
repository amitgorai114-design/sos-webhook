const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static("public"));
app.use(express.json());

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Ensure upload & log folders exist
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
if (!fs.existsSync("location_log.txt")) fs.writeFileSync("location_log.txt", "");

// Upload route
app.post("/upload", upload.single("cv"), (req, res) => {
  const { latitude, longitude } = req.body;

  const logEntry = `\n[${new Date().toLocaleString()}] Lat: ${latitude}, Lon: ${longitude}`;
  fs.appendFileSync("location_log.txt", logEntry);

  console.log("✅ CV uploaded:", req.file.filename);
  console.log("📍 Location:", latitude, longitude);

  res.send("File and location received successfully!");
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
