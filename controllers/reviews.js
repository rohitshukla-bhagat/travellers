const Listing = require("../modules/listing.js");
const Review = require("../modules/reviews.js");
module.exports.add = async (req, res) => {
  let listing = await Listing.findById(req.params.id); // extract the listing based on the id

  let newReview = await Review(req.body.review); // extract the review object from the form
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review Added Successfully !");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.delete = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // $pull : use for the items based on the condition from the array specified key-value
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted !");
  res.redirect(`/listings/${id}`);
};
