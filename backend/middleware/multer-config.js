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
// };const multer = require('multer');




































// const sharp = require('sharp');
// const fs = require('fs');
// const path = require('path');

// // Utiliser la mémoire (pas de fichier temporaire sur disque)
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// const resizeAndConvertToWebP = async (req, res, next) => {
//   if (!req.file) return next();

//   try {
//     const uploadDir = path.join(__dirname, '..', 'uploads');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }

//     const timestamp = Date.now();
//     const originalName = req.file.originalname.replace(/\s+/g, '-'); // sécurité : pas d'espaces
//     const filename = `${timestamp}-${originalName}.webp`;
//     const filepath = path.join(uploadDir, filename);

//     await sharp(req.file.buffer)
//       .resize(800, 800, { fit: 'inside' }) // adapte à 800px max
//       .webp({ quality: 80 })
//       .toFile(filepath);

//     // Ajouter info à req pour qu'on puisse l'utiliser après
//     req.file.filename = filename;
//     req.file.path = filepath;

//     next();
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = { upload, resizeAndConvertToWebP };




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














