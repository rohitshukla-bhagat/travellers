const User = require("../modules/user.js");
module.exports.signup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUpAdd = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome To Travallers !");
      res.redirect("/listings?filter=all");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.login = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loginCheck = async (req, res) => {
  req.flash("success", "Welcome Back To Travellers !");
  let redirctUrl = res.locals.redirectUrl || "/listings?filter=all";
  res.redirect(redirctUrl);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "User Logout Successfully !");
    res.redirect("/listings?filter=all");
  });
};
