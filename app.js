// NPM imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require("express-session");
const  mongoDBstore = require('connect-mongodb-session')(session);
require('dotenv').config();

// local imports
const connectDB = require('./util/database');
const mainRoutes = require('./routes/main');
const authRoutes = require('./routes/auth');
const User = require('./models/users');


const app = express();
const store = new mongoDBstore({
  uri: process.env.DATABASE_URI,
  collection: 'Sessions',
  expires: 3600
})
connectDB();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
      secret: "My Secret",
      resave: false,
      saveUninitialized: false,
      store: store
    })
  );
app.use(flash());

app.use(mainRoutes);

app.use(authRoutes);


app.listen(3000 , () => {
    console.log('listening on port 3000');
})