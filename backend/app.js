const express = require('express');
const mongoose = require('mongoose');
// require('dotenv').config(); // Assurez-vous d'utiliser dotenv pour les informations sensibles
const app = express();
const bookrouter = require('./routes/bookrouter');
const userrouter = require('./routes/userrouter');

// Connectez-vous à MongoDB
async function connect() {
    try {
        await mongoose.connect(
            'mongodb+srv://ibrahimallae1:Chocolat93@projet6.ek0u3.mongodb.net/projet6?retryWrites=true&w=majority'
        );
        console.log('Connexion à MongoDB réussie !');
    } catch (error) {
        console.error('Connexion à MongoDB échouée :', error.message);
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
// Middleware JSON
app.use(express.json());
//Routes
app.use('/api/books', bookrouter);
app.use('/api/auth', userrouter);


module.exports = app;
