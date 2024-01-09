// index.js

const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.urlencoded({ extended: true }));
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const routers = require('./routes');

// for Vercel path
if (process.env.VERCEL) {
  app.set('views', path.join(__dirname, 'views'));
} else {
  app.set('views', 'views');
  app.use('/public', express.static('public'));
}
app.set('view engine', 'ejs');

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 300000 },
  }),
);

// Connecting MongoDB
const mongodbUserName = process.env.MONGODB_USERNAME;
const mongodbPassword = process.env.MONGODB_PASSWORD;
const mongodbBaseUrl = process.env.MONGODB_URI;
mongoose
  .connect(
    `mongodb+srv://${mongodbUserName}:${mongodbPassword}@${mongodbBaseUrl}`,
  )
  .then(() => {
    console.log('Success: Connected to MongoDB');
  })
  .catch((error) => {
    console.log(error);
    console.error('Failure: Unconnected to MongoDB');
  });

app.use(routers);

// Page NotFound
app.get('*', (req, res) => {
  res.render('error', { message: 'ページが存在しません' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log(`Listening on localhost port ${PORT}`);
});
