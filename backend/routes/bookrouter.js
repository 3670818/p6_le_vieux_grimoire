const express = require('express');
const bookrouter = express.Router();
const controlbook = require('../controllers/controlbook');
const { upload, resizeImage } = require('../middleware/multer-config.js');
const storage = require('../middleware/multer-config');
const authMiddleware = require("../middleware/auth");
// const authMiddleware = require('../middleware/auth');


// bookrouter.get('/', upload.single("image"),controlbook.getbook);
//  bookrouter.post('/', upload.single('image'), controlbook.createBook);

bookrouter.get('/bestrating',authMiddleware,controlbook.BestRating);
bookrouter.post('/', authMiddleware,upload.single("image"),controlbook.createBook);
bookrouter.get('/:id',  authMiddleware,controlbook.getOneBook);
bookrouter.put('/:id', authMiddleware,controlbook.modifyBook)
bookrouter.get('/',  authMiddleware,controlbook.getAllBooks);
bookrouter.delete('/:id',  authMiddleware,controlbook.deleteBook);
bookrouter.post('/:id/rating', authMiddleware,controlbook.addRating);





module.exports = bookrouter;



