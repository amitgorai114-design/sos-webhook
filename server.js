import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 10000;

const __dirname = path.resolve();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Upload endpoint
app.post("/upload", upload.single("cv"), (req, res) => {
  res.send("CV uploaded successfully!");
});

// Location endpoint
app.post("/location", (req, res) => {
  const { latitude, longitude } = req.body;
  const log = `${new Date().toISOString()} - Lat: ${latitude}, Lng: ${longitude}\n`;
  fs.appendFileSync(path.join(__dirname, "locations.log"), log);
  res.send("Location received");
});

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
