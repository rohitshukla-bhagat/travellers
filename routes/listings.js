const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");

//? Index route
router.get("/", wrapAsync(listingController.index));

//? New route
router.get("/new", isLoggedIn, listingController.new);

//? Show route
router.get("/:id", wrapAsync(listingController.show));

//? Create route
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.create)
);

//? Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

//? Update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.update)
);

//? Delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.delete));

module.exports = router;
