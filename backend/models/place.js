const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    passoutYear: { type: String, required: true }, // Replaced address with passoutYear
    contactNumber: { type: String, required: true }, // Added contact number
    linkedIn: { type: String, required: true }, // Added LinkedIn link
    github: { type: String, required: true }, // Added GitHub link
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('Place', placeSchema);
