const router = require("express").Router();
const Room = require('../models/Room')

router.get('/rooms', (req, res, next) => {
	const loggedInUserId = req.user._id
	console.log(loggedInUserId)
	Room.find({ owner: loggedInUserId })
		.then(rooms => {
			res.render('rooms/index', { rooms })
		})
		.catch(err => {
			next(err)
		})
});

router.get('/rooms/add', (req, res, next) => {
	res.render('rooms/add')
});

router.post('/rooms', (req, res, next) => {
	const { name, price } = req.body
	// node basic auth: req.session.user 
	const loggedInUser = req.user
	Room.create({ name, price, owner: loggedInUser })
		.then(() => {
			res.redirect('/rooms')
		})
		.catch(err => {
			next(err)
		})
});

router.get('/rooms/:id/delete', (req, res, next) => {

	const roomId = req.params.id
	// if you are an admin you can delete any room
	// if you are a user you can only delete rooms that you have created

	const query = { _id: roomId }

	if (req.user.role === 'user') {
		query.owner = req.user._id
	}
	console.log(query)
	Room.findOneAndDelete(query)
		.then(() => {
			res.redirect('/rooms')
		})
		.catch(err => {
			next(err)
		})
});


module.exports = router;