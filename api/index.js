const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3001;

// Enable CORS for all domains
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Proxy the request
app.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://api.jsonserve.com/Uw5CrX');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
