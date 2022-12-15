const router = require("express").Router();
const { User, Post} = require("../../models");
const withAuth = require("../../utils/auth");

//get route to get all posts
router.get("/",withAuth, async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const allPosts = await Post.findAll({
      include: [User,Comment]
    });
    res.json(allPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new post
router.post('/',async (req, res) => {
  const body = req.body;
  console.log(body);
  console.log(req.session.user_id);
  try {
    const newPost = await Post.create({...body,user_id: req.session.user_id});
    res.json(newPost);

  } catch (err) {
    console.log(err);
    res.json(500).json(err);
  }
});
  

//Update a post

router.put('/:id', withAuth, async (req, res) => {
  try{
      console.log('here is my req.body', req.body);

      const [affectedRows] = await Post.update(req.body, {
          where: {
              id: req.params.id,
          },
      });

      if (affectedRows > 0) {
          res.status(200).end(); 
      } else {
          res.status(404).end();
      } 
  } catch (err) {
      res.status(500).json(err); 
  }
});


//Delete a post

router.delete("/:id", withAuth, async (req, res) => {
  try {
    const deletePost = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletePost) {
      res.status(404).json({ message: "No Post found with this id!" });
      return;
    }
    res.status(200).json(deletePost);
  } catch (err) {
    res.status(500).json(err);
  }
});

 module.exports = router;