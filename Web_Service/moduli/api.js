// Importazione del modulo Axios per le chiamate API
const axios = require('axios');

// Chiave API OpenWeatherMap dalle variabili d'ambiente
const apiKey = process.env.OPENWEATHERMAP_API_KEY;

// Significati degli indici di qualità dell'aria
const aqi_meanings = {
    1: "Discreta",
    2: "Buona",
    3: "Moderata",
    4: "Scarsa",
    5: "Molto Scarsa"
};

// Funzione API per ottenere la qualità dell'aria
exports.api = async function (lat, lon) {
    try {
        const apiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        let api_response = await axios.get(apiUrl);

        // Controllo sulla struttura della risposta
        if (!api_response.data || !api_response.data.list || api_response.data.list.length === 0) {
            throw new Error("Risposta API non valida");
        }

        let json_api = {
            "qualita": aqi_meanings[api_response.data.list[0].main.aqi]
        };

        return json_api;
    } catch (error) {
        console.error("Errore nella richiesta API:", error.message);
        return { error: "Impossibile recuperare i dati della qualità dell'aria" };
    }
};


//Per ottenere le coordinate di una determinata città tramite le API di openStreetMap (NON Leaflet)
document.getElementById("checkAirQuality").addEventListener("click", async function () {
    const citta = document.getElementById("citta").value;

    if (!citta) {
        alert("Inserisci il nome della città!");
        return;
    }

    try {
        const response = await fetch(`/geocode?citta=${encodeURIComponent(citta)}`);
        const data = await response.json();

        if (data.error) {
            alert("Errore: " + data.error);
        } else {
            document.getElementById("lat").value = data.lat;
            document.getElementById("lon").value = data.lon;
            alert(`Coordinate di ${citta}: Lat ${data.lat}, Lon ${data.lon}`);
        }
    } catch (error) {
        console.error("Errore nella richiesta:", error);
        alert("Errore nel recupero dei dati.");
    }
});
