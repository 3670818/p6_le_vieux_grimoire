const express = require('express');
const bookrouter = express.Router();
const controlbook = require('../controllers/controlbook');


bookrouter.post('/', controlbook.createBook);
bookrouter.get('/:id', controlbook.getOneBook);
bookrouter.put('/:id', controlbook.modifyBook)
bookrouter.get('/', controlbook.getAllBooks);
bookrouter.delete('/:id', controlbook.deleteBook);
bookrouter.post('/:id/rating', controlbook.addRating);



module.exports = bookrouter;







