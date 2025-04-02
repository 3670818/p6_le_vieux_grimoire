// const multer = require('multer');
// const sharp = require('sharp');
// const path = require('path');
// const fs = require('fs');





// // Configuration de multer pour le stockage des fichiers
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// const upload = multer({ storage: storage });




// // Fonction pour redimensionner les images
// const resizeImage = (req, res, next) => {
//   if (!req.file) {
//     return next();
//   }

//   const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);

//   sharp(filePath)
//     .resize(800, 800) // Redimensionner l'image à 800x800 pixels
//     .toFile(filePath, (err, info) => {
//       if (err) {
//         return next(err);
//       }
//       next();
//     });
// };

// module.exports = { upload, resizeImage };


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
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// Middleware pour redimensionner et convertir en WebP
const resizeAndConvertToWebP = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    const webpFilePath = filePath.replace(/\.\w+$/, '.webp'); // Change l'extension en .webp

    await sharp(filePath)
      .resize(800, 800) // Redimensionner à 800x800 pixels
      .toFormat('webp') // Convertir en WebP
      .webp({ quality: 80 }) // Qualité 80%
      .toFile(webpFilePath);

    // Supprime l'ancien fichier (JPEG/PNG/etc.)
    fs.unlinkSync(filePath);

    // Mise à jour du fichier dans req.file pour refléter la nouvelle version WebP
    req.file.filename = path.basename(webpFilePath);
    req.file.path = webpFilePath;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { upload, resizeAndConvertToWebP };























