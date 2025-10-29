// server.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Create uploads directory if not exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configure file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Serve homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Upload route
app.post("/upload", upload.single("cv"), (req, res) => {
  const { latitude, longitude } = req.body;

  // Save log
  const logEntry = `✅ CV uploaded: ${req.file.filename}\n📍 Location received: ${latitude}, ${longitude}\n`;
  console.log(logEntry);
  fs.appendFileSync("location.log", logEntry);

  res.status(200).send("✅ Uploaded successfully with location!");
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
