const express = require('express');
const { check } = require('express-validator');

const placesControllers = require('../controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:pid', placesControllers.getPlaceById); // Ensure getPlaceById is defined
router.get('/user/:uid', placesControllers.getPlacesByUserId); // Ensure getPlacesByUserId is defined

router.use(checkAuth); // Ensure checkAuth is defined

router.post(
  '/',
  fileUpload.single('image'), // Ensure fileUpload is properly imported
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('passoutYear').not().isEmpty(),
    check('contactNumber').not().isEmpty(),
    check('linkedIn').not().isEmpty(),
    check('github').not().isEmpty(),
    check('LPA').not().isEmpty(),
  ],
  placesControllers.createPlace // Ensure createPlace is defined
);

router.patch(
  '/:pid',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('passoutYear').not().isEmpty(),
    check('contactNumber').not().isEmpty(),
    check('linkedIn').not().isEmpty(),
    check('github').not().isEmpty(),
    check('LPA').not().isEmpty(),
  ],
  placesControllers.updatePlace // Ensure updatePlace is defined
);

router.delete('/:pid', placesControllers.deletePlace); // Ensure deletePlace is defined
console.log(placesControllers);

module.exports = router;
