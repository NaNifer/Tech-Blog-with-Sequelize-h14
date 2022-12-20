const router = require("express").Router();
const { Post, User } = require("../models");
const withAuth = require("../utils/auth");

//Get All existing Posts associated to a specific User

router.get("/", withAuth, async (req, res) => {
  try {
    const getPost = await Post.findAll({
      where: { user_id: req.session.user_id },
      include: User,
    });
    const posts = getPost.map((post) => post.get({ plain: true })); 
    res.render("all-posts-dashboard", {
      layout: "dashboard",
      posts,
    });
  } catch (err) {
    res.redirect("login");
  }
});

// After clicking on newpost button
router.get('/new',withAuth,(req, res) => {
  res.render('new-post', {
    layout: 'dashboard',
  });
});

// Creating a new post 
router.get("/edit/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id);
    if (postData) {
      const post = postData.get({ plain: true });
      console.log(postData);
      res.render("edit-post", {
        layout: "dashboard",
        post,
      });
    } else {
      res.status(400).end();
    }
  } catch (err) {
    res.redirect("login");
  }
});

module.exports = router;