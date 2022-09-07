const router = require("express").Router();

// middleware
const loginCheck = () => {
  return (req, res, next) => {
    // this is how you check for the authenticated user using passport
    if (req.isAuthenticated()) {
      next()
    } else {
      res.redirect('/login')
    }
  }
}

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/profile', (req, res, next) => {
  // retrieve the logged in user
  const loggedInUser = req.user
  res.render('profile', { user: loggedInUser })
});


module.exports = router;
