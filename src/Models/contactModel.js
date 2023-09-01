const mongoose = require("mongoose");
const validator = require("validator");

const ContactSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    default: "",
  },
  surname: {
    type: String,
    require: false,
    default: "",
  },
  email: {
    type: String,
    require: false,
    default: "",
  },
  phone: {
    type: String,
    require: false,
    default: "",
  },
  address: {
    type: String,
    require: false,
    default: "",
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
});

const ContactModel = mongoose.model("contact", ContactSchema);

class Contact {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.contact = null;
  }

  async register() {
    this.validation();

    if (this.errors.length > 0) return;

    this.contact = await ContactModel.create(this.body);

    if (!this.contact)
      return this.errors.push("error registering a new contact");
  }
  async getContactById(id) {
    const user = await ContactModel.findById(id);
    return user;
  }

  async edit(id) {
    this.validation();
    if (this.errors.length > 0) return;

    this.contact = await ContactModel.findByIdAndUpdate(id, this.body, {
      new: true,
    });

    if (!this.contact) return;
  }
  async showContacts() {
    const contacts = await ContactModel.find().sort({ create_at: -1 });
    if (!contacts) return this.errors.push("your agend has no contacts saved");
    return contacts;
  }
  async delete(id) {
    const contact = await ContactModel.findOneAndDelete({ _id: id });
    return contact;
  }
  validation() {
    this.cleanUp();

    if (!this.body.name) {
      this.errors.push("name is required camp");
      return;
    }

    if (this.body.email && !validator.isEmail(this.body.email)) {
      this.errors.push("email is invalid");
      return;
    }

    if (!this.body.email && !this.body.phone) {
      this.errors.push(
        "you have to setting email or phone to register your contact"
      );
      return;
    }
  }
  cleanUp() {
    for (let key in this.body) {
      if (typeof this.body[key] !== "string") this.body[key] = "";
    }

    this.body = {
      name: this.body.name,
      surname: this.body.surname,
      email: this.body.email,
      phone: this.body.phone,
      address: this.body.address,
    };
  }
}

module.exports = Contact;
