const express = require('express');

const router = express.Router();





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


module.export= UserRoute