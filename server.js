const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// Serve index.html directly
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// File upload setup
const upload = multer({ dest: "uploads/" });
app.post("/upload", upload.single("cvFile"), (req, res) => {
  console.log("📁 File uploaded:", req.file);
  res.send("File uploaded successfully!");
});

app.listen(port, () => console.log(`✅ Server running on port ${port}`));
