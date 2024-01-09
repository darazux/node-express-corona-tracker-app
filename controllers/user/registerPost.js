// registerPost.js

const UserModel = require('../../models/user');

module.exports = async (req, res) => {
  try {
    const userData = req.body;
    await UserModel.create(userData);
    res.redirect('/user/login');
  } catch (error) {
    console.log(error);
    res.render('error', { message: '/user/createのエラー' });
  }
};
