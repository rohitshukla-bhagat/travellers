let Listing = require("./modules/listing.js");
const { listingSchema } = require("./joiSchema.js");
const { reviewSchema } = require("./joiSchema.js");
const expressError = require("./utilities/expressError.js");
const Review = require("./modules/reviews.js");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please First Login For Create A Listing !");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing !");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new expressError(400, error);
  } else {
    next();
  }
};

module.exports.validateSchema = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  // let errMsg = error.details.map((el) => el.message).join(",");
  if (error) {
    throw new expressError(400, error);
  } else {
    next();
  }
};

module.exports.isReviewOwner = async (req, res, next) => {
  let { id , reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this review !");
    return res.redirect(`/listings/${id}`);
  }
  next();
};