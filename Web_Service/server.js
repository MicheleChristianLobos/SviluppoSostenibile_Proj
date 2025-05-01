require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path'); // Importa il modulo path

const app = express();
const PORT = 3000;

app.use(cors());

// Servire i file statici dalla cartella "public"
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint per ottenere i dati della qualità dell'aria
app.get('/api/air-quality', async (req, res) => {
  try {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY; // Chiave API da .env
    const lat = req.query.lat || 37.7749; // Latitudine (default: San Francisco)
    const lon = req.query.lon || -122.4194; // Longitudine (default: San Francisco)
    const apiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const response = await axios.get(apiUrl);
    res.json(response.data); // Restituisci i dati al frontend
  } catch (error) {
    console.error('Errore nella richiesta API:', error.message);
    res.status(500).json({ error: 'Errore nel recupero dei dati' });
  }
});

// Route per servire il file index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server in esecuzione su http://localhost:${PORT}`);
});