const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/activity');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/activity', routes);

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});