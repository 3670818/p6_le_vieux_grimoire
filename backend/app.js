const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());
const Thing = require('./models/books');

async function connect() {
    try {
        await mongoose.connect(
            'mongodb+srv://ibrahimallae1:Chocolat93@projet6.ek0u3.mongodb.net/projet6?retryWrites=true&w=majority',
            { appName: 'projet6' } // Option pour l'application
        );
        console.log('Connexion à MongoDB réussie !');
    } catch (error) {
        console.error('Connexion à MongoDB échouée !', error);
    }
}

connect();

// Middleware pour permettre les CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

module.exports = app;
