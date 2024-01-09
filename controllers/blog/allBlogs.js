// allBlogs.js

const BlogModel = require('../../models/blog');

module.exports = async (req, res) => {
  const userId = req.session.userId;
  const allBlogs = await BlogModel.find();
  res.render('index', { allBlogs: allBlogs, session: userId });
};
