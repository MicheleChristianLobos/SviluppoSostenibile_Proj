// Importazione del modulo Axios per le chiamate API
const axios = require('axios');

// Chiave API OpenWeatherMap dalle variabili d'ambiente
const APIKEY = process.env.OPENWEATHERMAP_API_KEY;

// Significati degli indici di qualità dell'aria
const AQI_MEANINGS = {
    1: "Discreta",
    2: "Buona",
    3: "Moderata",
    4: "Scarsa",
    5: "Molto Scarsa"
};

// Funzione API per ottenere la qualità dell'aria
exports.api = async function (lat, lon) {
    try {
        const apiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${APIKEY}`;
        let api_response = await axios.get(apiUrl);

        // Controllo sulla struttura della risposta
        if (!api_response.data || !api_response.data.list || api_response.data.list.length === 0) {
            throw new Error("Risposta API non valida");
        }

        let json_api = {
            "coords": {
                "lat": api_response.data.coord.lat,
                "lon": api_response.data.coord.lon
            },
            "aqi_txt": AQI_MEANINGS[api_response.data.list[0].main.aqi] || "N/D",
            "aqi_int": api_response.data.list[0].main.aqi,
            "comps": {
                "co": api_response.data.list[0].components.co,
                "no": api_response.data.list[0].components.no,
                "no2": api_response.data.list[0].components.no2,
                "o3": api_response.data.list[0].components.o3,
                "so2": api_response.data.list[0].components.so2,
                "pm2_5": api_response.data.list[0].components.pm2_5,
                "pm10": api_response.data.list[0].components.pm10,
                "nh3": api_response.data.list[0].components.nh3
            },
            "dt_txt": new Date(api_response.data.list[0].dt * 1000).toLocaleString(),
            "dt_unix": api_response.data.list[0].dt,
        };
        
        return json_api;
    } catch (error) {
        console.error("Errore nella richiesta API:", error.message);
        return { error: "Impossibile recuperare i dati della qualità dell'aria" };
    }
};