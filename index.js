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
app.get('/', async (req, res) => {
  const allBlogs = await BlogModel.find();
  res.send('全ブログデータを読み取りました');
});

// Read Single Blog
app.get('/blog/:id', async (req, res) => {
  const id = req.params.id;
  const singleBlog = await BlogModel.findById(id);
  console.log(singleBlog);
  res.send('個別の記事ページ');
});

// Update Blog
app.get('/blog/update/:id', async (req, res) => {
  const id = req.params.id;
  const singleBlog = await BlogModel.findById(id);
  res.send('個別の記事編集ページ');
});

app.post('/blog/update/:id', async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  try {
    const updateResult = await BlogModel.updateOne({ _id: id }, updateData);
    res.send('ブログデータの編集が失敗しました');
  } catch (error) {
    console.log(error);
    res.send('ブログデータの編集が成功しました');
  }
});
// Delete Blog
app.get('/blog/delete/:id', async (req, res) => {
  const id = req.params.id;
  const singleBlog = await BlogModel.findById(id);
  res.send('個別記事削除ページ');
});

app.post('/blog/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await BlogModel.deleteOne({ _id: id });
    res.send('ブログデータの削除が成功しました');
  } catch (error) {
    console.log(error);
    res.send('ブログデータの削除が失敗しました');
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log(`Listening on localhost port ${PORT}`);
});
