const router = require('express').Router();
const { User } = require('../../models');

//signup
router.post('/signup', async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password
    });
    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true;
      res.json(newUser);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

//login route
router.post('/login', async (req, res) => {
  try {
    const userLogin = await User.findOne({ where: { username: req.body.username } });

    if (!userLogin) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }
    const validPassword = await userLogin.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userLogin.id;
      req.session.username = userLogin.username;
      req.session.logged_in = true;
      
      res.json({ userLogin, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

//logout route
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).json({message: 'Sucessfully logged out!'})
    });
  } else {
    res.status(404).json({message: 'Sucessfully logged out'});
  }
});

module.exports = router;