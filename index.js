// index.js

const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.urlencoded({ extended: true }));
const mongoose = require('mongoose');

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

const BlogModel = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

app.get('/blog/create', (req, res) => {
  res.sendFile(__dirname + '/views/blogCreate.html');
});

app.post('/blog/create', async (req, res) => {
  console.log('req ', req.body);
  try {
    const blog = await BlogModel.create(req.body);
    console.log('データの書き込みが成功しました');
    res.send('投稿成功');
  } catch (error) {
    console.log('データの書き込みが失敗しました');
    console.log(error);
    res.send('投稿失敗');
  }
});

// Read All Blogs
app.get('/', function (req, res) {
  res.send('<h1>こんにちは</h1>');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log(`Listening on localhost port ${PORT}`);
});
