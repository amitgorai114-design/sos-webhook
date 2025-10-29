import express from "express";
import path from "path";
import multer from "multer";
import fs from "fs";

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const upload = multer({ dest: "uploads/" });

// Serve the main HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Handle file upload
app.post("/upload", upload.single("cv"), (req, res) => {
  console.log("📄 CV uploaded:", req.file.originalname);
  res.send("CV uploaded successfully!");
});

// Receive location data
app.post("/location", (req, res) => {
  const { latitude, longitude } = req.body;
  const log = `${new Date().toISOString()} - ${latitude}, ${longitude}\n`;
  fs.appendFileSync("locations.log", log);
  console.log("📍 Location saved:", latitude, longitude);
  res.status(200).send("Saved");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
