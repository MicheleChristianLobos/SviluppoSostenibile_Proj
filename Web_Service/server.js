require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const aq_api = require('./moduli/api.js');

const latDefault = process.env.LATITUDE;
const lonDefault = process.env.LONGITUDE;

const PORT = process.env.PORT;
const app = express();

app.use(cors());  //Abilitato "Cross Origin Resource Sharing"
app.set('views', path.join(__dirname, 'public', 'views', 'pug'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

// Visualizza index.pug
app.get('/', (req, res) => {
  res.render('index'); // Renderizza public/views/pug/index.pug
});

// Visualizza sviluppo.pug
app.get('/sviluppo', (req, res) => {
  res.render('sviluppo'); // Renderizza public/views/pug/sviluppo.pug
});

app.get('/mappa', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'html', 'map.html'));
});

// Rotta CSS
app.get('/css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'css', 'style.css'));
});

// Rotta chiamata API
app.get('/api', async function (req, res) {
  const lat = req.query.lat || latDefault;
  const lon = req.query.lon || lonDefault;

  console.log(`Richiesta a /api?lat=${lat}&lon=${lon}`);

  try {
      const response = await aq_api.api(lat, lon);
      res.status(200).json(response);
  } catch (error) {
      console.error("Errore API:", error);
      res.status(500).json({ error: "Errore nel recupero dei dati" });
  }
});

// Rotta chiamata API per la mappa
app.get('/air', async (req, res) => {
  try {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY; 
    const lat = req.query.lat || latDefault;
    const lon = req.query.lon || lonDefault;
    const apiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Errore nella richiesta API:', error.message);
    res.status(500).json({ error: 'Errore nel recupero dei dati' });
  }
});

app.get('/geolocalizzazione', (req, res) => {
  res.render('geolocalizzazione');
});

// Rotta sfondo foglie
app.get('/bg_foglie', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'img', 'jpg', 'bg_foglie.jpg'));
});;

app.use("*", function (req, res) {
  res.status(404).send('Url non presente');
});

app.listen(PORT, () => {
  console.log(`Server in esecuzione su http://${process.env.IP}:${PORT}`);
});