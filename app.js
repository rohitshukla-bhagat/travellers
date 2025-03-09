if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const expressError = require("./utilities/expressError.js");
const ejsMate = require("ejs-mate");
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");
const MONGODB_URL = process.env.ATLASDB_URL;
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./modules/user.js");

main()
  .then(() => {
    console.log("Connection Successful !");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGODB_URL);
}

const store = MongoStore.create({
  mongoUrl: MONGODB_URL,
  touchAfter: 24 * 60 * 60,
  crypto : {
    secret : process.env.SECRET,
  }
});

store.on("error" , () => {
  console.log("Session Store Error !" , err);
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    htttpOnly: true,
  },
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "fakeuser@gmai.com",
    username: "demo-user",
  });
  let registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser);
});

app.get("/" , (req , res)=>{
  res.render("/listings");
});

//! Listings
app.use("/listings", listingsRouter);

//! Reviews
app.use("/listings/:id/reviews", reviewsRouter);

//! Users
app.use("/", userRouter);

//? Handle the path which is not initialize in the app
app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found !"));
});

//? Custom Error Handling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong !" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(port, () => {
  console.log(`App Is Listening At Port ${port}`);
});
