const router = require("express").Router();
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get('/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', {
	successRedirect: '/profile',
	failureRedirect: '/signup'
}));



router.get('/signup', (req, res, next) => {
	res.render('signup')
});

router.get('/login', (req, res, next) => {
	res.render('login')
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/profile',
	failureRedirect: '/login'
}));


router.post('/signup', (req, res, next) => {
	const { username, password } = req.body
	// is the password + 4 chars
	if (password.length < 4) {
		res.render('signup', { message: 'Your password needs to be min 4 chars' })
		return
	}
	if (username.length === 0) {
		res.render('signup', { message: 'Your username cannot be empty' })
		return
	}
	// validation passed
	// do we already have a user with that username in the db?
	User.findOne({ username: username })
		.then(userFromDB => {
			if (userFromDB !== null) {
				res.render('signup', { message: 'Username is alredy taken' })
			} else {
				// we can use that username
				// and hash the password
				const salt = bcrypt.genSaltSync()
				const hash = bcrypt.hashSync(password, salt)
				// create the user
				User.create({ username, password: hash })
					.then(createdUser => {
						console.log(createdUser)
						// if we want to log the user in using passport
						// req.login()
						res.redirect('/login')
					})
					.catch(err => next(err))
			}
		})
});

router.get('/logout', (req, res, next) => {
	req.logout(function (err) {
		if (err) { return next(err); }
		res.redirect('/');
	});
});


module.exports = router;