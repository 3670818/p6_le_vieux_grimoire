const Book = require('../models/Book'); // Assume this is your Book model
const {booktest }= require('../models/booktest');



exports.createBook = async (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    const book = new Book({
        ...bookObject,
          imageUrl: `${req.file.filename}`
    });
    book.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({error}));
}


exports.getbook = (req, res) => {
  res.send(booktest);
  console.log(booktest)
}

// Update an existing book
exports.modifyBook = (req, res, next) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Book updated!' }))
        .catch(error => res.status(400).json({ error }));
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


// Delete a book
exports.deleteBook = (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Book deleted!' }))
        .catch(error => res.status(400).json({ error }));
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






exports.BestRating = async (req, res, next) => {
  try {
      // Find the book with the best rating
      const bestRatedBook = await Book.find().sort({ rating: -1 }).limit(3);
      

      if (!bestRatedBook) {
          return res.status(404).json({ message: 'No books found' });
      }

      res.status(200).json(bestRatedBook);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
  
};





