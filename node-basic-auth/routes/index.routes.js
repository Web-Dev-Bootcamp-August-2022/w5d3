const router = require("express").Router();

// this middleware is used to protect a route
function loginCheck() {
  return (req, res, next) => {
    // check if the user is logged in
    if (req.session.user !== undefined) {
      // the user is logged in 
      // they can visit the page that they requested
      next()
    } else {
      // the user is not logged in
      // we redirect
      res.redirect('/auth/login')
    }
  }
}

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/profile', loginCheck(), (req, res, next) => {
  // whenever you want to use user info in a view
  // these are the steps
  // access the logged in user

  // bonus: handling cookies
  // to set a cookie
  res.cookie('myCookie', 'hello from the server')
  // to access a cookie
  console.log(req.cookies)
  // this will delete the cookie in the client browser
  res.clearCookie('myCookie')
  const username = req.session.user.username
  res.render('profile', { username: username })
});


module.exports = router;
