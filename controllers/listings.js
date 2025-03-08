const Listing = require("../modules/listing");
module.exports.index = async (req, res) => {
  const filter = req.query.filter || "all";
  const search = req.query.search;
  if (search) {
    if (!search || search.trim() === "") {
      req.flash("error", "Please provide a valid search query !");
      res.redirect("/listings?filter=all");
    }
    const allListings = await Listing.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ],
    });
    if (allListings.length === 0) {
      req.flash("error", "No Listings Found !");
      res.redirect("/listings?filter=all");
    }
    res.render("listings/index.ejs", { allListings });
  } else {
    if (filter === "all") {
      const allListings = await Listing.find({});
      res.render("listings/index.ejs", { allListings });
    } else {
      const allListings = await Listing.find({ category: filter });
      res.render("listings/index.ejs", { allListings });
    }
  }
};

module.exports.new = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate("reviews")
    .populate("owner");
  await listing.populate("reviews.author");
  if (!listing) {
    req.flash("error", "Listing Not Found !");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.create = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created !");
  res.redirect("/listings?filter=all");
};

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Listing Not Found !");
    res.redirect("/listings?filter=all");
  }
  let originalUrl = list.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/h_200,w_250");
  res.render("listings/update.ejs", { list, originalUrl });
};

module.exports.update = async (req, res) => {
  if (!req.body.listing) {
    throw new expressError(400, "Send the valid data");
  }
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated Successfully !");
  res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully !");
  res.redirect("/listings?filter=all");
};
