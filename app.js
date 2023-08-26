// NPM imports
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const mongoDBstore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const multer = require("multer");
require("dotenv").config();

// local imports
const connectDB = require("./util/database");
const mainRoutes = require("./routes/main");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const User = require("./models/users");

const app = express();

const store = new mongoDBstore({
  uri: process.env.DATABASE_URI,
  collection: "Sessions",
});

const csrfProtection = csrf();
connectDB();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "photos");
  },
  filename: (req, file, cb) => {
    const uniqueIdentifier = Date.now(); // or any other unique identifier
    cb(null, uniqueIdentifier + '-' + file.originalname);
  }
});


const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' || 
    file.mimetype === 'image/avif' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({storage: fileStorage, fileFilter: fileFilter }).single("photo")
);


app.use(express.static(path.join(__dirname, "public")));
app.use('/photos',express.static(path.join(__dirname, "photos")));
app.use(
  session({
    secret: "My Secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }

      req.user = user;

      next();
    })

    .catch((err) => {
      throw new Error(err);
    });
});

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.isAdmin = req.session.user && req.session.user.isAdmin;
  next();
});

app.use(adminRoutes);

app.use(mainRoutes);

app.use(authRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("listening on port 3000");
});
