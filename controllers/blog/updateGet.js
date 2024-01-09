// updateGet.js

const BlogModel = require('../../models/blog');

module.exports = async (req, res) => {
  const id = req.params.id;
  const singleBlog = await BlogModel.findById(id);
  res.render('blogUpdate', { singleBlog });
};
