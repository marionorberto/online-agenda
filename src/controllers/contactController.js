const Contact = require("../Models/contactModel");

exports.index = (req, res) => {
  res.render("contact", {
    contactRegistered: {},
  });
};

exports.register = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.register();

    if (contact.errors.length > 0) {
      req.flash("errors", contact.errors);
      req.session.save(() => {
        return res.redirect("/contact/index");
      });
      return;
    }

    req.flash("success", "contact created successfully");
    req.session.contact = contact.contact;
    req.session.save(() => {
      return res.redirect(`/contact/index/${contact.contact._id}`);
    });
  } catch (err) {
    console.log(err);
    return res.render("404");
  }
};

exports.editContact = async (req, res) => {
  if (!req.params.id) return res.render("404");
  const contact = new Contact();
  const contactRegistered = await contact.getContactById(req.params.id);

  if (!contactRegistered) return res.render("404");

  res.render("contact", {
    contactRegistered,
  });
};

exports.edit = async (req, res) => {
  try {
    if (!req.params.id) return;

    const contact = new Contact(req.body);

    await contact.edit(req.params.id);

    if (contact.errors.length > 0) {
      req.flash("errors", contact.errors);
      req.session.save(function () {
        return res.redirect(`/contact/index/${req.params.id}`);
      });
      return;
    }

    req.flash("success", "contact edited sucessfully");
    req.session.save(function () {
      return res.redirect(`/contact/index/${req.params.id}`);
    });
  } catch (err) {
    console.log(err);
    return res.render("404");
  }
};

exports.delete = async (req, res) => {
  try {
    if (!req.params.id) return;

    const contact = new Contact();
    const contactDeleted = await contact.delete(req.params.id);

    if (!contactDeleted) {
      req.flash("errors", "contact does not exists");
      req.session.save(() => {
        return res.redirect("/");
      });
      return;
    }

    req.flash("success", "contact deleted sucessfully");
    req.session.save(() => {
      return res.redirect("/");
    });
    
  } catch (err) {
    console.log(err);
    return res.render("404");
  }
};
