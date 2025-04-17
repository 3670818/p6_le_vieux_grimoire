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

// Formats d’entrée autorisés
const SUPPORTED_INPUT_MIMES = [
  'image/jpeg', // jpg/jpeg
  'image/png',
  'image/gif',
  'image/webp',
  'image/tiff'
];

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

  const { mimetype, filename } = req.file;
  if (!SUPPORTED_INPUT_MIMES.includes(mimetype)) {
    return next(new Error(`Format non supporté : ${mimetype}`));
  }

  try {
    const filePath    = path.join(__dirname, '..', 'uploads', filename);
    const webpPath    = filePath.replace(/\.\w+$/, '.webp');

    // Initialiser pipeline Sharp
    let img = sharp(filePath);

    // Spécificités selon le format d’entrée
    if (mimetype === 'image/jpeg') {
      // désactiver le progressive pour éviter les erreurs libvips
      img = img.jpeg({ progressive: false });
    } else if (mimetype === 'image/png') {
      // compression PNG maximale
      img = img.png({ compressionLevel: 9 });
    } else if (mimetype === 'image/gif') {
      // Sharp ne gère que la 1ère frame d’un GIF animé
      // Pour un vrai GIF animé → gif2webp ou ffmpeg
      img = img;
    }
    // Pour image/webp ou image/tiff, pas de préprocessing particulier

    // Redimensionner (800×800 max, garde le ratio) & convertir en WebP
    await img
      .resize({ width: 800, height: 800, fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(webpPath);

    console.log('✅ Image convertie en WebP :', webpPath);

    // Supprimer l’original
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('🗑️ Image originale supprimée');
    }

    // Mettre à jour req.file pour la suite (ex: sauvegarde en BDD)
    req.file.filename = path.basename(webpPath);
    req.file.path     = webpPath;

    next();
  } catch (err) {
    console.error('❌ Erreur de conversion ou suppression du fichier :', err.message);
    next(err);
  }
};

module.exports = { upload, resizeAndConvertToWebP };















