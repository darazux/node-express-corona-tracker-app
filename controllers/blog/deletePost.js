// deletePost.js

const BlogModel = require('../../models/blog');

module.exports = async (req, res) => {
  try {
    const id = req.params.id;
    await BlogModel.deleteOne({ _id: id });
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.render('error', { message: '/blog/deleteのエラー' });
  }
};
