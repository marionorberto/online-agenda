const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

const { join } = require("path");
const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("mongodb connected");
    app.emit("ready");
  } catch (err) {
    console.log("error trying connecting to mongo database: ", err);
  }
};
connection();

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const helmet = require("helmet");
const csrf = require("csurf");

const routes = require(join(__dirname, "routes"));
const { middlewareGlobal, checkCsrfMiddleware, csrfMiddleware } = require(join(
  __dirname,
  "src",
  "middlewares",
  "middleware"
));

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));
app.use(express.json());

const sessionOptions = session({
  secret: process.env.SECRECT_STRING,
  store: MongoStore.create({ mongoUrl: process.env.CONNECTION_STRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 604800000,
    httpOnly: true,
  },
});
app.use(sessionOptions);
app.use(flash());

app.set("views", join(__dirname, "src", "views"));
app.set("view engine", "ejs");

app.use(csrf());

app.use(middlewareGlobal);
app.use(checkCsrfMiddleware);
app.use(csrfMiddleware);
app.use(routes);

app.on("ready", () => {
  app.listen(port, () => {
    console.log(`Acess -> http://localhost:${port}`);
    console.log(`server is running at port:${port}`);
  });
});
