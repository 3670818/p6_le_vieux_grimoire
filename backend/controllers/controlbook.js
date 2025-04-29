const Book = require('../models/Book'); // Assume this is your Book model
const {booktest }= require('../models/booktest');
const fs = require('fs');
const path = require('path');


exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }

            //  Vérification de l'autorisation
            if (book.userId !== req.user.userId) {
                return res.status(403).json({ message: 'Unauthorized to delete this book' });
            }

            // Récupérer le chemin du fichier image
            const imagePath = path.join(__dirname, '../uploads', book.imageUrl);

            // Supprimer le fichier image
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Erreur lors de la suppression de l\'image:', err);
                }

                // Supprimer le livre de la base de données
                Book.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Book deleted!' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};






exports.createBook = async (req, res, next) => {
    try {
        // Vérifie si req.body.book existe et est un JSON valide
        if (!req.body.book) {
            return res.status(400).json({ message: 'Aucun livre à enregistrer. Les données sont manquantes.' });
        }

        const bookObject = JSON.parse(req.body.book); // Convertir en objet si nécessaire
        const book = new Book({
            ...bookObject, // Déstructure les données de l'objet book
            imageUrl: `${req.file.filename}`  // L'URL de l'image est générée après le téléchargement du fichier
        });

        await book.save(); // Sauvegarde le livre dans la base de données
        res.status(201).json({ message: 'Livre enregistré !' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};





exports.modifyBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }

            // 🛡 Vérification de l'autorisation
            if (book.userId !== req.user.userId) {
                return res.status(403).json({ message: 'Unauthorized to modify this book' });
            }

            // Mise à jour du livre
            Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Book updated!' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};



exports.getOneBook = async (req, res, next) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Assurez-vous que l'URL de l'image est correctement formée
        book.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${book.imageUrl}`;

        res.status(200).json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



// Get all books


// Fonction pour générer l'URL de l'image
const generateImageUrl = (req, filename) => {
    return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

exports.getAllBooks = async (req, res, next) => {
    try {
        const books = await Book.find();

        // Modifier l'URL de l'image pour chaque livre
        const booksWithImageUrls = books.map(book => {
            return {
                ...book._doc,
                imageUrl: generateImageUrl(req, book.imageUrl)
            };
        });

        res.status(200).json(booksWithImageUrls);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};




exports.addRating = async (req, res, next) => {
  try {
      const book = await Book.findOne({ _id: req.params.id });

      if (!book) {
          return res.status(404).json({ message: 'Book not found' });
      }

      const existingRating = book.ratings.find(rating => rating.userId === req.body.userId);

      if (existingRating) {
          return res.status(401).json({ message: 'Vous avez déjà publié une note !' });
      }

      book.ratings.push({ userId: req.body.userId, grade: req.body.rating });
      book.averageRating = parseFloat((book.ratings.reduce((a, b) => a + b.grade, 0) / book.ratings.length).toFixed(1));

      const bookModified = await Book.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { ratings: { userId: req.body.userId, grade: req.body.rating } }, $set: { averageRating: book.averageRating } },
          { new: true }
      );

      res.status(200).json(bookModified);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};







// Fonction pour générer l'URL de l'image
const generateImage = (req, filename) => {
    return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

exports.BestRating = async (req, res, next) => {
    try {
        // Find the books with the best ratings
        const bestRatedBooks = await Book.find().sort({ averageRating: -1 }).limit(3);

        if (!bestRatedBooks || bestRatedBooks.length === 0) {
            return res.status(404).json({ message: 'No books found' });
        }

        // Modify the image URL for each book
        const booksWithImageUrls = bestRatedBooks.map(book => {
            return {
                ...book._doc,
                imageUrl: generateImage(req, book.imageUrl)
            };
        });

        res.status(200).json(booksWithImageUrls);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};