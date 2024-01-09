// createGet.js

module.exports = (req, res) => {
  // no session data exist
  if (!req.session.userId) {
    res.redirect('/user/login');
    return;
  }
  res.render('blogCreate');
};
