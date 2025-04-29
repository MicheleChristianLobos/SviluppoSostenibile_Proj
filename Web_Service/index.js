const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();
const app = express();
const port = 3000;

app.use(express.static('public'));

// Route per la pagina HTML
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
  });
  
  // Route per ottenere i dati della mappa
  app.get("/electricity-data", async (req, res) => {
    try {
      const response = await axios.get("https://api.electricitymaps.com/v3/data", {
        headers: {
          Authorization: `Bearer ${process.env.ELECTRICITYMAPS_API_KEY}`,
        },
      });
      res.json(response.data);
    } catch (error) {
      res.status(500).send("Errore nell'ottenere i dati.");
    }
  });
  

dotenv.config();
console.log("Chiave API:", process.env.ELECTRICITYMAPS_API_KEY); // Controlla che venga mostrata

process.on("uncaughtException", (err) => {
    console.error("Errore non gestito:", err);
});
  