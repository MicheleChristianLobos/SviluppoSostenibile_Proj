require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const mymodule = require('./moduli/api');

const app = express();
const PORT = 3000;

//app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/air', async (req, res) => {
  try {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY; 
    const lat = req.query.lat || 37.7749;
    const lon = req.query.lon || -122.4194;
    const apiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Errore nella richiesta API:', error.message);
    res.status(500).json({ error: 'Errore nel recupero dei dati' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'html', 'map.html'));
});

app.get('/api', function (req, res) {
  console.log("Richiesta a /api");
  res.status(200).json(mymodule.api());
});

app.use("*", function (req, res) {
  res.status(404).send('Url non presente');
});

app.listen(PORT, () => {
  console.log(`Server in esecuzione su http://localhost:${PORT}`);
});