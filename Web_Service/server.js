const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

// Sostituisci con la tua chiave API di Electricity Maps
const ELECTRICITY_MAPS_API_KEY = 'RMJjL4r10v46DO6EElam';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/data', async (req, res) => {
  try {
    const response = await axios.get('https://api.electricitymaps.com/v3/data', {
      headers: {
        'Authorization': `Bearer ${ELECTRICITY_MAPS_API_KEY}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Errore nel recupero dei dati:', error);
    res.status(500).send('Errore nel recupero dei dati');
  }
});

app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});

app.get('/api/hourly-data', async (req, res) => {
try {
    const response = await axios.get('https://api.electricitymaps.com/v3/hourly', {
    headers: {
        'Authorization': `Bearer ${ELECTRICITY_MAPS_API_KEY}`
    }
    });
    res.json(response.data);
} catch (error) {
    console.error('Errore nel recupero dei dati orari:', error);
    res.status(500).send('Errore nel recupero dei dati orari');
}
});
