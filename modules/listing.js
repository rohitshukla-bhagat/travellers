const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Reviews = require("./reviews.js");

const listingSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: [
      "Rooms",
      "Luxe",
      "City",
      "Mountain",
      "Desert",
      "Boats",
      "Tower",
      "Castles",
      "Beach",
      "Pools",
      "LakeFront",
      "Skiing",
      "Tree",
      "Cloudy",
      "Moisture",
      "Rich",
      "Poor",
      "Nature",
      "Igloo",
      "Children",
    ],
    require: true,
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Reviews.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const listing = mongoose.model("Listing", listingSchema);

module.exports = listing;
