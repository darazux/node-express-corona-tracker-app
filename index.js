// index.js

const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.urlencoded({ extended: true }));
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

// for Vercel path
if (process.env.VERCEL) {
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static('./public'));
} else {
  app.set('views', 'views');
  app.use('/public', express.static('public'));
}
app.set('view engine', 'ejs');

// Session
app.use(
  session({
    secret: 'secretKey',
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

const Schema = mongoose.Schema;
const BlogSchema = new Schema({
  title: String,
  summary: String,
  image: String,
  textBody: String,
});

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const BlogModel = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

app.get('/blog/create', (req, res) => {
  // no session data exist
  if (!req.session.userId) {
    res.redirect('/user/login');
    return;
  }
  res.render('blogCreate');
});

app.post('/blog/create', async (req, res) => {
  try {
    const blog = await BlogModel.create(req.body);
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.render('error', { message: '/blog/createのエラー' });
  }
});

// Read All Blogs
app.get('/', async (req, res) => {
  const userId = req.session.userId;
  const allBlogs = await BlogModel.find();
  res.render('index', { allBlogs: allBlogs, session: userId });
});

// Read Single Blog
app.get('/blog/:id', async (req, res) => {
  const id = req.params.id;
  const userId = req.session.userId;
  const singleBlog = await BlogModel.findById(id);
  res.render('blogRead', { singleBlog: singleBlog, session: userId });
});

// Update Blog
app.get('/blog/update/:id', async (req, res) => {
  const id = req.params.id;
  const singleBlog = await BlogModel.findById(id);
  res.render('blogUpdate', { singleBlog });
});

app.post('/blog/update/:id', async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  try {
    const updateResult = await BlogModel.updateOne({ _id: id }, updateData);
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.render('error', { message: '/blog/updateのエラー' });
  }
});
// Delete Blog
app.get('/blog/delete/:id', async (req, res) => {
  const id = req.params.id;
  const singleBlog = await BlogModel.findById(id);
  res.render('blogDelete', { singleBlog });
});

app.post('/blog/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await BlogModel.deleteOne({ _id: id });
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.render('error', { message: '/blog/deleteのエラー' });
  }
});

// UserFunctioin
// Create user
app.get('/user/create', (req, res) => {
  res.render('userCreate');
});

app.post('/user/create', async (req, res) => {
  try {
    const userData = req.body;
    const userModel = await UserModel.create(userData);
    res.redirect('/user/login');
  } catch (error) {
    console.log(error);
    res.render('error', { message: '/user/createのエラー' });
  }
});

// Login user
app.get('/user/login', (req, res) => {
  res.render('login');
});

app.post('/user/login', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const savedUserData = await UserModel.findOne({ email: email });
    if (!savedUserData) {
      res.render('error', {
        message: '/user/loginのエラー：ユーザーが存在しません',
      });
      return;
    }
    if (password !== savedUserData.password) {
      res.render('error', {
        message: '/user/loginのエラー：パスワードが間違っています',
      });
      return;
    }
    req.session.userId = savedUserData._id;
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log(`Listening on localhost port ${PORT}`);
});
