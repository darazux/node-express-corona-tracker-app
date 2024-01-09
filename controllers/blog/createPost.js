// createPost.js

const BlogModel = require('../../models/blog');

module.exports = async (req, res) => {
  try {
    await BlogModel.create(req.body);
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.render('error', { message: '/blog/createのエラー' });
  }
};
