const Book = require('../models/Book'); // Assume this is your Book model
const {booktest }= require('../models/booktest');




exports.getbook = (req, res) => {
    res.send(booktest);
    console.log(booktest)
}


exports.createBook = (req, res, next) => {
  try {
    // Parse the book object from the request body
    const bookObject = JSON.parse(req.body.book);

    const { title, author, year, genre, userId, ratings, averageRating } = bookObject;

    // Validate request body
    if (!userId || !title || !author || !year || !genre || !ratings || !averageRating) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const book = new Book({
      userId,
      title,
      author,
      year,
      genre,
      ratings,
      averageRating,
      imageUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    });

    book.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
      .catch(error => {
        console.error('Error saving book:', error);
        res.status(400).json({ error: 'Error saving book' });
      });
  } catch (error) {
    console.error('Error parsing request body:', error);
    res.status(400).json({ error: 'Invalid request body' });
  }
};



















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



