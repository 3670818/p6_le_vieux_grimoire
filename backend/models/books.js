const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
  title: { type: String, required: true },
  auteur: { type: String, required: true },
  annee: { type: Number, required: true },
  genre: { type: String, required: true },
  note: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  
});

module.exports = mongoose.model('Thing', thingSchema);