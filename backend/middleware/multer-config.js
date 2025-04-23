const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Formats d’entrée autorisés
const SUPPORTED_INPUT_MIMES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/tiff'
];

// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

const resizeAndConvertToWebP = async (req, res, next) => {
  if (!req.file) return next();

  const { mimetype, filename } = req.file;
  if (!SUPPORTED_INPUT_MIMES.includes(mimetype)) {
    return next(new Error(`Format non supporté : ${mimetype}`));
  }

  try {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const originalPath = path.join(uploadsDir, filename);
    const webpPath = originalPath.replace(/\.\w+$/, '.webp');

    // 🔄 Lire le contenu du fichier en buffer
    const inputBuffer = await fs.promises.readFile(originalPath);

    // 🔧 Traitement de l'image depuis le buffer (plus de verrou sur le fichier)
    await sharp(inputBuffer)
      .resize({ width: 800, height: 800, fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(webpPath);

    console.log('✅ Image convertie en WebP :', webpPath);

    // 🧹 Supprimer l’original
    await fs.promises.unlink(originalPath);
    console.log('🗑️ Image originale supprimée');

    // Mettre à jour req.file
    req.file.filename = path.basename(webpPath);
    req.file.path = webpPath;

    next();
  } catch (err) {
    console.error('❌ Erreur de conversion/remplacement :', err.message);
    next(err);
  }
};

module.exports = { upload, resizeAndConvertToWebP };

