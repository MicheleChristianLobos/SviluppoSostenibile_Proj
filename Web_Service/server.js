// Dipendenze del progetto
const express = require('express'); //importo il framework Express
const app = express();
const fs = require('fs'); //importo il modulo per la gestione del File System
const morgan = require('morgan');  //importo il modulo per la gestione dei logger
const path = require('path'); //importo il modulo per la gestione dei percorsi delle cartelle e dei file
const helmet = require('helmet'); //importo il modulo per rendere il server web piu sicuro
const mymodule = require('./moduli/frase_del_giorno');
const cors = require('cors');// Cors (Cross origin resource sharing, protocollo che permette il passaggio di dati tra applicazioni e domini diversi)
const bodyParser = require('body-parser');//Per leggere i parametri POST occorre preventivamente installare il modulo body-parser

//Sezione impostazione dell’app (app.set)
app.set('port', process.env.PORT || 3000); //imposta la porta in cui è in ascolto il server
app.set('appName', 'Web Service'); //imposta il nome dell'applicazione web

//Sezione Middleweare
//Middleweare Morgan: per la creazione di un logger
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('short', { stream: accessLogStream }));
//Middleweare sicurezza helmet
app.use(helmet());
//Middleweare CORS
app.use(cors());
//Middleweare per il parsing del corpo delle richieste
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware di log delle richieste (esempio)
app.use(function (req, res, next) {
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    next();
});

// Dati di esempio per gli utenti (in una vera applicazione useresti un database)
let users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
];

//id univoco
let nextId;
if (users.length > 0) {
  nextId = Math.max(...users.map(function(utente) {
    return utente.id;
  })) + 1;
} else {
  nextId = 1;
}

//Sezione Route
//Route per la frase del giorno
/*app.get('/frase_del_giorno', function (req, res) {
    console.log("Richiesta a /frase_del_giorno");
    res.status(200).json(mymodule.fraseDelGiorno());
});*/

/*Sviluppo sostenibile*/ 
// Route per ottenere l'intensità di carbonio in Italia
app.get('/carbon-intensity', async function (req, res) {
    fetch('https://api.electricitymap.org/v3/carbon-intensity/latest?zone=IT', {
    method: 'GET',
    headers: {
        'auth-token': 'RMJjL4r10v46DO6EElam'
    }
})
.then(response => response.json())
.then(data => console.log(data));
});




//Route per ottenere tutti gli utenti
app.get('/utenti', function (req, res) {
    console.log("Richiesta a /utenti");
    res.status(200).json(users);
});

//Route per ottenere un utente specifico tramite ID
app.get('/utenti/:id', function (req, res) {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ error: 'Utente non trovato' });
    }
});

//Route per creare un nuovo utente
app.post('/utenti', function (req, res) {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Il nome dell\'utente è obbligatorio' });
    }
    const newUser = {
        id: nextId++,
        name: name
    };
    users.push(newUser);
    console.log('Utente creato:', newUser);
    res.status(201).json(newUser); // 201 Created
});

//Route per aggiornare un utente esistente
app.put('/utenti/:id', function (req, res) {
    const userId = parseInt(req.params.id);
    const { name } = req.body;
    const userIndex = users.findIndex(u => u.id === userId);

	//metodo che utilizza lo spread operator (...) per creare un 
	//nuovo oggetto basato sull'oggetto utente esistente 
	//con l'aggiunta della proprietà name
    if (userIndex !== -1) {
        if (!name) {
            return res.status(400).json({ error: 'Il nome dell\'utente è obbligatorio per l\'aggiornamento' });
        }
        users[userIndex] = { ...users[userIndex], name };
        console.log('Utente aggiornato:', users[userIndex]);
        res.status(200).json(users[userIndex]);
    } else {
        res.status(404).json({ error: 'Utente non trovato' });
    }
	//un altro metodo per aggiornare users usa l'assegnazione Diretta delle Proprietà
	//if (userIndex !== -1 && name !== undefined) {
    //	users[userIndex].name = name;
    //	console.log('Utente aggiornato:', users[userIndex]);
    //	res.status(200).json(users[userIndex]);
	//}
});

//Route per eliminare un utente specifico
app.delete('/utenti/:id', function (req, res) {
    const userIdToDelete = parseInt(req.params.id);
    const initialLength = users.length;
    users = users.filter(user => user.id !== userIdToDelete);

    if (users.length < initialLength) {
        console.log('Utente eliminato con ID:', userIdToDelete);
        res.status(204).send(); // <--- Dovrebbe essere solo questo
    } else {
        res.status(404).json({ error: 'Utente non trovato' });
    }
});

//Middleweare che gestisce l’errore nel caso che nessuna route vada a buon fine
app.use("*", function (req, res) {
    res.status(404).send('Url non presente');
});

//Avvio del server su una porta specifica
const server = app.listen(app.get('port'), function () {
    console.log(`Server in ascolto sulla porta ${app.get('port')}`);
    console.log(`Nome dell'applicazione: ${app.get('appName')}`);
});




