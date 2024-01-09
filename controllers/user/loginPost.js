// loginPost.js

const UserModel = require('../../models/user');

module.exports = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const savedUserData = await UserModel.findOne({ email: email });
    if (!savedUserData) {
      res.render('error', {
        message: '/user/loginのエラー：ユーザーが存在しません',
      });
      return;
    }
    if (password !== savedUserData.password) {
      res.render('error', {
        message: '/user/loginのエラー：パスワードが間違っています',
      });
      return;
    }
    req.session.userId = savedUserData._id;
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
};
