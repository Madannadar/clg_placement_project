const express = require('express');
const { check } = require('express-validator');

const placesControllers = require('../controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.use(checkAuth);

router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('passoutYear')
      .not()
      .isEmpty(), // Updated from address to passoutYear
    check('contactNumber')
      .not()
      .isEmpty(), // Added contact number validation
    check('linkedIn')
      .not()
      .isEmpty(), // Added LinkedIn link validation
    check('github')
      .not()
      .isEmpty(), // Added GitHub link validation
  ],
  placesControllers.createPlace
);

router.patch(
  '/:pid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('passoutYear')
      .not()
      .isEmpty(), // Validate passoutYear during updates
    check('contactNumber')
      .not()
      .isEmpty(), // Validate contact number during updates
    check('linkedIn')
      .not()
      .isEmpty(), // Validate LinkedIn link during updates
    check('github')
      .not()
      .isEmpty(), // Validate GitHub link during updates
  ],
  placesControllers.updatePlace
);

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;
