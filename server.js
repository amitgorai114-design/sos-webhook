// server.js
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let latest = null;

app.post('/share-location', (req, res) => {
  latest = { ...req.body, receivedAt: Date.now() };
  console.log('Received:', latest);
  // Here you can add notify logic (SMS, email) if you want
  res.status(200).json({ ok: true });
});

app.get('/latest', (req, res) => {
  if (!latest) return res.status(404).json({ error: 'No location yet' });
  res.json(latest);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server running on port', port));
