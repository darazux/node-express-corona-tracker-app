// singleBlog.js

const BlogModel = require('../../models/blog');

module.exports = async (req, res) => {
  const id = req.params.id;
  const userId = req.session.userId;
  const singleBlog = await BlogModel.findById(id);
  res.render('blogRead', { singleBlog: singleBlog, session: userId });
};
