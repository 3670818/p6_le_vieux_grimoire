const bcrypt = require('bcrypt');
const User = require('../models/User'); // Assume this is your User model
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    // Générez le token ici avant de répondre au client
                    const token = jwt.sign(
                        { userId: user._id }, // Le payload contient l'ID de l'utilisateur
                        process.env.JWT_SECRET, // Utilise une clé secrète stockée dans ton fichier .env
                        { expiresIn: "2h" } // La durée d'expiration du token
                    );

                    res.status(200).json({
                        userId: user._id,
                        token: token // Retourne le token généré ici
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
