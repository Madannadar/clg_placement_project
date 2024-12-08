const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  passoutYear: { type: String, required: true },  // Passout Year field
  contactNumber: { type: String, required: true },
  linkedIn: { type: String, required: true },
  github: { type: String, required: true },
  package: { type: String, required: true },  // Added package field
  image: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('Place', placeSchema);
