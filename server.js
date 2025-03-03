const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'src')));

// Chemin vers le fichier contacts.json
const contactsFilePath = path.join(__dirname, 'data', 'contacts.json');

// Créer le répertoire de données s'il n'existe pas
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// Créer le fichier contacts.json s'il n'existe pas
if (!fs.existsSync(contactsFilePath)) {
    fs.writeFileSync(contactsFilePath, JSON.stringify([]));
}

// Endpoint pour lire les contacts 
app.get('/contacts', (req, res) => {
    try {
        const contacts = fs.readFileSync(contactsFilePath, 'utf8');
        res.send(contacts);
    } catch (err) {
        console.error('Erreur lors de la lecture du fichier contacts.json:', err);
        res.status(500).send('Erreur serveur: impossible de lire les contacts');
    }
});

// Endpoint pour écrire les contacts 
app.post('/contacts', (req, res) => {
    try {
        fs.writeFileSync(contactsFilePath, JSON.stringify(req.body, null, 2));
        res.status(200).send('Contacts sauvegardés avec succès');
    } catch (err) {
        console.error('Erreur lors de l\'écriture dans le fichier contacts.json:', err);
        res.status(500).send('Erreur serveur: impossible de sauvegarder les contacts');
    }
});

// Route par défaut pour SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur minimaliste démarré sur le port ${PORT}`);
});

module.exports = app; 