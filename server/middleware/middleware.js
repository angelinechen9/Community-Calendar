const validateUser = (req, res, next) => {
  if (req.session.userId) {
    next();
  }
  else {
    req.flash("errorMessages", {message: "Please login."});
    res.redirect("/login");
  }
}
module.exports = {validateUser}
