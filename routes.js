const routes = require("express").Router();
const { join } = require("path");
const homeController = require(join(
  __dirname,
  "src",
  "controllers",
  "homeController"
));

const loginController = require(join(
  __dirname,
  "src",
  "controllers",
  "loginController"
));

const contactController = require(join(
  __dirname,
  "src",
  "controllers",
  "contactController"
));

const { loginRequired } = require("./src/middlewares/middleware");
// home routes:
routes.get("/", homeController.index);

//login routes:
routes.get("/login/index", loginController.index);
routes.post("/login/register", loginController.register);
routes.post("/login/login", loginController.login);
routes.get("/login/logout", loginController.logout);

//contacts routes:
routes.get("/contact/index", loginRequired, contactController.index);
routes.post("/contact/register", contactController.register);
routes.get("/contact/index/:id", contactController.editContact);
routes.post("/contact/edit/:id", contactController.edit);
routes.get("/contact/delete/:id", contactController.delete);

//exportation:
module.exports = routes;
