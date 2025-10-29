require('dotenv').config();
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL, pass: process.env.PASS }
});

app.post('/upload', upload.single('cv'), async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    console.log(`✅ CV uploaded: ${req.file.filename}`);
    console.log(`📍 Location received: ${latitude}, ${longitude}`);

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL_TO,
      subject: '📄 New CV Uploaded with Location',
      text: `✅ New CV uploaded: ${req.file.filename}

📍 Location Details:
Latitude: ${latitude || 'Not available'}
Longitude: ${longitude || 'Not available'}
Google Maps: https://www.google.com/maps?q=${latitude},${longitude}`,
      attachments: [
        { filename: req.file.originalname, path: req.file.path }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully!');
    res.send('✅ File uploaded and email sent with location!');
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).send('Error sending email');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
