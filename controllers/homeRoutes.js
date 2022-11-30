const router = require("express").Router();

// const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

//Get All Posts for Homepage
router.get("/", withAuth, async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const getAllPosts = await Post.findAll({
      include: [User, Comment],
    });
    const posts = getAllPosts.map((post) => post.get({ plain: true }));
    res.render('all-posts-homepage', {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get a single Post for Homepage
router.get("/post/:id", withAuth, async (req, res) => {
  try {
    const singlePost = await Post.findOne({
      where: [
        User,
        {
         model: Comment,
         include: [User],
      },
    ],
    
  });

    if (singlePost) {
      const post = singlePost.get({ plain: true });
      console.log(post);
      res.render("single-post", { post, logged_in: req.session.logged_in });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//Login and Sign-up routes
router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  res.render("login");;
});

router.get("/signup", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("signup");
});

module.exports = router;