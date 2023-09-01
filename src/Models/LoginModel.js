const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const LoginSchema = mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
});

const LoginModel = mongoose.model("user", LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }
  async login() {
    this.validation();

    if (this.errors.lenght > 0) return;

    this.user = await LoginModel.findOne({ email: this.body.email });

    if (!this.user) {
      this.errors.push("user invalid");
      return;
    }

    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push("password invalid");
      this.user = null;
      return;
    }
  }

  async register() {
    this.validation();

    if (this.errors.length > 0) return;

    await this.userExists();

    if (this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body);
  }

  validation() {
    this.cleanUp();

    // ensure that is a valid email:
    if (!validator.isEmail(this.body.email)) this.errors.push("invalid email.");

    // ensure that password range is between 4 to 50
    if (this.body.password.length < 4 || this.body.password.length > 50)
      this.errors.push("password length must be between 4 to 50 caracteres");
  }

  async userExists() {
    const user = await LoginModel.findOne({ email: this.body.email });

    if (user) {
      return this.errors.push("user already exists");
    }
  }

  cleanUp() {
    // ensure that body is a string:
    for (let key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }

    //ensure that body is receiveing email & password only:
    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = Login;
