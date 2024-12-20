const express = require('express');
const bookrouter = express.Router();
const controlbook = require('../controllers/controlbook');
const { upload, resizeImage } = require('../middleware/multer-config');
const storage = require('../middleware/multer-config');


// bookrouter.get('/', upload.single("image"),controlbook.getbook);

//  bookrouter.post('/', upload.single('image'), controlbook.createBook);
bookrouter.post('/',upload.single("image"),controlbook.createBook);
bookrouter.get('/:id', controlbook.getOneBook);
bookrouter.put('/:id', controlbook.modifyBook)
bookrouter.get('/', controlbook.getAllBooks);
bookrouter.delete('/:id', controlbook.deleteBook);
bookrouter.post('/:id/rating', controlbook.addRating);






module.exports = bookrouter;



