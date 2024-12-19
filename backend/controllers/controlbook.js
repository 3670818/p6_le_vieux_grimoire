const Book = require('../models/Book'); // Assume this is your Book model

exports.createBook = (req, res) => {
  // Delete _id to prevent overriding
  delete req.body._id;

  const book = new Book({
      ...book,
      
  });
  book.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({error}));
}


// Update an existing book
exports.modifyBook = (req, res, next) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Book updated!' }))
        .catch(error => res.status(400).json({ error }));
};

// Get a specific book by ID
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

// Get all books
exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

// Delete a book
exports.deleteBook = (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Book deleted!' }))
        .catch(error => res.status(400).json({ error }));
};


// Add rating to book and recalculate average rating
exports.addRating = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book.ratings.some(rating => rating.userId === req.body.userId)) {
                book.ratings.push({ userId: req.body.userId, grade: req.body.rating });
                book.averageRating = parseFloat((book.ratings.reduce((a, b) => a + b.grade, 0) / book.ratings.length).toFixed(1));

                Book.findOneAndUpdate({ _id: req.params.id }, { $push: { ratings: { userId: req.body.userId, grade: req.body.rating } }, $set: { averageRating: book.averageRating } }, {new: true})
                    .then((bookModified) => res.status(200).json(bookModified))
                    .catch(error => res.status(400).json({ error }));
            }
            else res.status(401).json({ message: 'Vous avez déjà publié une note !' });
        })
        .catch(error => res.status(400).json({ error }));
}



