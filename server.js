const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// Set up multer to store uploaded files in /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Middleware
app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); // make uploads public
app.use(express.urlencoded({ extended: true }));

// Upload route
app.post("/upload", upload.single("cv"), (req, res) => {
  const file = req.file;
  const { latitude, longitude } = req.body;

  if (!file) {
    return res.status(400).send("No file uploaded");
  }

  console.log(`✅ CV uploaded: ${file.filename}`);
  console.log(`📍 Location: ${latitude}, ${longitude}`);

  // Save location data to file
  const logData = `${new Date().toISOString()} - File: ${file.filename} - Location: ${latitude}, ${longitude}\n`;
  fs.appendFileSync("location.log", logData);

  // Response page
  res.send(`
    <h2>✅ CV uploaded successfully!</h2>
    <p>📄 <a href="/uploads/${file.filename}" target="_blank">View Uploaded CV</a></p>
    <p>📍 Location: ${latitude}, ${longitude}</p>
    <a href="/">⬅ Go Back</a>
  `);
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
