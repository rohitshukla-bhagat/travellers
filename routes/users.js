const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

//? SignUp
router.get("/signup", userController.signup);

//? SignUp add
router.post("/signup", wrapAsync(userController.signUpAdd));

//? Login
router.get("/login", userController.login);

//? Login check
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.loginCheck
);

//? Logout
router.get("/logout", userController.logout);

module.exports = router;
