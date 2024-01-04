// index.js

const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send('<h1>こんにちは</h1>');
});

app.get('/blog/create', (req, res) => {
  res.sendFile(__dirname + '/views/blogCreate.html');
});

app.post('/blog/create', (req, res) => {
  console.log('req ', req);
  res.send('投稿完了');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log(`Listening on localhost port ${PORT}`);
});
