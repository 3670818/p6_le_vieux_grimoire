const express = require('express');
const app = express();
const mongoose = require('mongoose');

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

// Middleware pour analyser le corps des requêtes en JSON
app.use(express.json());

// Route GET pour récupérer des objets
app.use('/api/stuff', (req, res, next) => {
    const stuff = [
      {
        _id: 'oeihfzeoi',
        title: 'Mon premier objet',
        description: 'Les infos de mon premier objet',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        price: 4900,
        userId: 'qsomihvqios',
      },
    ];
    res.status(200).json(stuff);
});

function signup(req, res) {
    const { email, password } = req.body; // Récupération des données du corps de la requête
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    console.log("Signup body:", req.body);
    res.status(201).json({ 
        message: "User successfully registered",
        data: { email }
    });
}

function login(req, res) {
    const { email, password } = req.body; // Récupération des données du corps de la requête
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    console.log("Login body:", req.body);

    // Exemple de réponse pour une connexion réussie
    res.status(200).json({
        message: "User logged in successfully",
        userId: "1234",
        token: "valide"
    });
}

// Ajout des routes
app.post("/api/auth/signup", signup);
app.post("/api/auth/login", login);

module.exports = app;
