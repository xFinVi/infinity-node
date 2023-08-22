// NPM imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require("express-session");
const  mongoDBstore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
require('dotenv').config();

// local imports
const connectDB = require('./util/database');
const mainRoutes = require('./routes/main');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const User = require('./models/users');


const app = express();

const store = new mongoDBstore({
  uri: process.env.DATABASE_URI,
  collection: 'Sessions',
})

const csrfProtection = csrf();
connectDB();


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
      secret: "My Secret",
      resave: false,
      saveUninitialized: false,
      store: store
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


app.listen(3000 , () => {
    console.log('listening on port 3000');
})