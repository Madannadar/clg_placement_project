const fs = require('fs');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Place = require('../models/place');
const User = require('../models/user');

// Get Place by ID
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(new HttpError('Something went wrong, could not find a place.', 500));
  }

  if (!place) {
    return next(new HttpError('Could not find place for the provided id.', 404));
  }

  res.json({ place: place.toObject({ getters: true }) });
};

// Get Places by User ID
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (err) {
    return next(new HttpError('Fetching places failed, please try again later.', 500));
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(new HttpError('Could not find places for the provided user id.', 404));
  }

  res.json({
    places: userWithPlaces.places.map(place => place.toObject({ getters: true }))
  });
};

// Create Place
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description, passoutYear, contactNumber, linkedIn, github, LPA, branch } = req.body;

  const createdPlace = new Place({
    title,
    description,
    passoutYear,
    contactNumber,
    linkedIn,
    github,
    LPA,
    branch, // Add 'branch' field
    image: req.file.path,
    creator: req.userData.userId
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    return next(new HttpError('Creating place failed, please try again.', 500));
  }

  if (!user) {
    return next(new HttpError('Could not find user for provided id.', 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError('Creating place failed, please try again.', 500));
  }

  res.status(201).json({ place: createdPlace });
};

// Update Place
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description, passoutYear, contactNumber, linkedIn, github, LPA, branch } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(new HttpError('Something went wrong, could not update place.', 500));
  }

  if (place.creator.toString() !== req.userData.userId) {
    return next(new HttpError('You are not allowed to edit this place.', 401));
  }

  place.title = title;
  place.description = description;
  place.passoutYear = passoutYear;
  place.contactNumber = contactNumber;
  place.linkedIn = linkedIn;
  place.github = github;
  place.LPA = LPA;
  place.branch = branch; // Update branch field

  try {
    await place.save();
  } catch (err) {
    return next(new HttpError('Something went wrong, could not update place.', 500));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};


exports.updatePlace = updatePlace;

// Delete Place
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
    console.log('Fetched place:', place);
  } catch (err) {
    console.error('Error fetching place:', err);
    return next(new HttpError('Something went wrong, could not delete place.', 500));
  }

  if (!place) {
    console.warn(`Place with ID ${placeId} not found.`);
    return next(new HttpError('Could not find place for this id.', 404));
  }

  if (place.creator.id.toString() !== req.userData.userId.toString()) {
    console.warn('Unauthorized delete attempt by user:', req.userData.userId);
    return next(new HttpError('You are not allowed to delete this place.', 401));
  }

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await Place.deleteOne({ _id: placeId }, { session: sess }); // Updated method
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
    console.log('Place deleted successfully:', placeId);
  } catch (err) {
    console.error('Error during deletion process:', err);
    return next(new HttpError('Something went wrong, could not delete place.', 500));
  }

  // After a successful transaction
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error('Failed to delete image file:', err);
    } else {
      console.log('Image file deleted successfully:', imagePath);
    }
  });

  res.status(200).json({ message: 'Deleted place.' });
};




exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
