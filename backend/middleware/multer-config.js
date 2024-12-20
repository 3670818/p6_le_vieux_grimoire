const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');





// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });




// Fonction pour redimensionner les images
const resizeImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);

  sharp(filePath)
    .resize(800, 800) // Redimensionner l'image à 800x800 pixels
    .toFile(filePath, (err, info) => {
      if (err) {
        return next(err);
      }
      next();
    });
};

module.exports = { upload, resizeImage };
