// const homeModel = require("../Models/HomeModel");
// const bcryptjs = require("bcryptjs");

// function hashPassword(salt, password) {
//   return bcryptjs.hashSync(password, salt);
// }

// homeModel
//   .create({
//     name: "Maria",
//     surname: "Josefa",
//     email: "mariajosefa@gmai.com",
//     password: hashPassword(bcryptjs.genSaltSync(), "2222"),
//   })
//   .then((user) => console.log(user))
//   .catch((error) => console.log("error creating an user:", error));

const Contact = require("../Models/contactModel");

exports.index = async (req, res) => {
  try {
    const contact = new Contact();
    const contacts = await contact.showContacts();

    if (contact.errors.length > 0) {
      return req.flash("errors", contact.errors);
    }

    res.render("index", { contacts });
  } catch (err) {
    console.log(err);
    res.render("404");
  }
};
