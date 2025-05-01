import express from 'express'
import bodyParser from 'body-parser'
import { join } from 'path'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const PORT = 3000   //Porta su cui ascolta il server
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter, { utenti: [] })

await db.read()
db.data ||= { utenti: [] }
await db.write()


const app = express()
app.set('view engine', 'pug')
app.set('views', join(__dirname, 'views'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))


let nextId;
if (db.data.utenti.length > 0) {
  nextId = Math.max(...db.data.utenti.map(function(utente) {
    return utente.id;
  })) + 1;
} else {
  nextId = 1;
}

app.get("/", async (req, res) => {
    //L'await permette di leggere i dati dal file che fa da database prima di portare alla pagina principale (Index)
    await db.read()
    res.render('index', { utenti: db.data.utenti })
});

app.get("/registrazione", (req, res) => {
    res.render("registrazione");
});

app.get('/utenti/:id', async (req, res) => {
    await db.read()
    const userId = parseInt(req.params.id, 10)
    const user = db.data.utenti.find(user => user.id === userId)
    
    if (!user) {
        return res.status(404).render('error', { message: 'Utente non trovato.' })
    }
    res.render('utenti', { utenti: user })
})

app.post('/admin/utenti', async (req, res) => {
    const { nome, cognome, dataNascita, sesso, notifiche, preferenze, note } = req.body
    if (!nome || !cognome || !dataNascita || !sesso || !notifiche || !preferenze) {
        return res.status(400).send('Mancano dei campi obbligatori da compilare.');
    }

    const newUser = {
        id: nextId++,
        nome: nome, 
        cognome: cognome, 
        dataNascita: dataNascita, 
        sesso, 
        notifiche, 
        preferenze, 
        note
    }
    db.data.utenti.push(newUser)
    await db.write()
    res.redirect('/')
});


// Middleware

app.use("*", (req, res, next) => {
    res.status(404);
    res.send("URL non presente");
});


const server = app.listen(PORT, () => {
    console.log(`Server in esecuzione: http://localhost:${PORT}`)
})