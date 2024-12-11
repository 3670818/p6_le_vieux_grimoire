const express = require('express');
const app = express();

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

// Route POST pour le signup
app.post("/api/auth/signup", signup);

function signup(req, res) {
    const body = req.body; // Récupération du corps de la requête
    console.log("body:", body);
    res.status(200).json({ message: "Login successful", data: body });
}

module.exports = app;
