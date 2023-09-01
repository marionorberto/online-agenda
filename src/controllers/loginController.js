const Login = require("../Models/LoginModel");

exports.index = (req, res) => {
  if (req.session.user) {
    return res.render("login-logado");
  }
  res.render("login");
};

exports.register = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.register();

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      req.session.save(function () {
        return res.redirect("/login/index");
      });
      return;
    }

    req.flash("success", "user registered sucessfully");
    req.session.save(function () {
      return res.redirect("/login/index");
    });
  } catch (err) {
    console.log(err);
    return res.render("404");
  }
};

exports.login = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.login();

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      req.session.save(function () {
        return res.redirect("/login/index");
      });
      return;
    }

    req.flash("success", "welcome to your account!");
    req.session.user = login.user;
    req.session.save(function () {
      return res.redirect("/login/index");
    });
  } catch (err) {
    console.log(err);
    return res.render("404");
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
