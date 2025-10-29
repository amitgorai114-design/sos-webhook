const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Upload route
app.post("/upload", upload.single("cv"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded!");
  res.send("✅ CV uploaded successfully!");
});

// Location route
app.post("/location", (req, res) => {
  const { latitude, longitude } = req.body;
  if (!latitude || !longitude) {
    return res.status(400).send("Missing location data");
  }

  const log = `Latitude: ${latitude}, Longitude: ${longitude}\n`;
  fs.appendFileSync("locations.log", log);
  res.send("✅ Location received and logged!");
});

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
