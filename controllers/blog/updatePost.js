// updatePost.js

const BlogModel = require('../../models/blog');

module.exports = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    await BlogModel.updateOne({ _id: id }, updateData);
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.render('error', { message: '/blog/updateのエラー' });
  }
};
