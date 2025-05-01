const express = require('express');
const bookrouter = express.Router();
const controlbook = require('../controllers/controlbook');
const { upload ,resizeAndConvertToWebP} = require('../middleware/multer-config');
const storage = require('../middleware/multer-config');
const authMiddleware = require("../middleware/auth");


bookrouter.get('/bestrating',controlbook.BestRating);
bookrouter.post('/', upload.single('image'), resizeAndConvertToWebP,authMiddleware, controlbook.createBook);

bookrouter.get('/:id', controlbook.getOneBook);
bookrouter.put('/:id', authMiddleware,controlbook.modifyBook)
bookrouter.get('/', controlbook.getAllBooks);
bookrouter.delete('/:id',  authMiddleware,controlbook.deleteBook);
bookrouter.post('/:id/rating', authMiddleware,controlbook.addRating);







module.exports = bookrouter;



