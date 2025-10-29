// server.js
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { Resend } from "resend";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup for local uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Initialize Resend API
const resend = new Resend(process.env.RESEND_API_KEY);

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Upload endpoint
app.post("/upload", upload.single("cv"), async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    // Log location to location.log
    const logEntry = `✅ CV uploaded: ${req.file.filename}\n📍 Location: ${latitude}, ${longitude}\n\n`;
    fs.appendFileSync("location.log", logEntry);

    console.log(logEntry);

    // Send Email via Resend API
    await resend.emails.send({
      from: "SOS Webhook <no-reply@soswebhook.com>",
      to: "amitgorai114@gmail.com",
      subject: "📍 New CV Uploaded with Location",
      html: `
        <h2>New CV Uploaded</h2>
        <p><b>File:</b> ${req.file.filename}</p>
        <p><b>Location:</b> ${latitude}, ${longitude}</p>
        <p>Check local uploads folder for the CV.</p>
      `,
    });

    console.log("📧 Email sent via Resend API successfully!");
    res.status(200).send("CV uploaded and location logged successfully!");
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
