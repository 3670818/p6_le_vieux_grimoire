const express = require('express');
const userrouter = express.Router();
const controluser = require('../controllers/controluser'); // Import des fonctions




userrouter.post("/signup", controluser.signup);
userrouter.post("/login", controluser.login);



module.exports= userrouter;













