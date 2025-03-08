const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams: true - merge the parent and child routes
const wrapAsync = require("../utilities/wrapAsync.js");
const {
  validateSchema,
  isLoggedIn,
  isReviewOwner,
} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//? Add Route
router.post("/", isLoggedIn, validateSchema, wrapAsync(reviewController.add));

//? Delete Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewOwner,
  wrapAsync(reviewController.delete)
);

module.exports = router;
