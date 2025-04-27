const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const BookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings:[
      {
          userId: { type: String, required: true },
          grade: { type: Number, required: true }
      }
  ],
  averageRating: { type: Number, required: true, default: 0 },

});
BookSchema.plugin(uniqueValidator);
// const books=mongoose.model('books',BookSchema);


module.exports = mongoose.model("Book", BookSchema);



