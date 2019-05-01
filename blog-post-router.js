const express = require('express');
const router = express.Router();
const { listPost } = require('./blog-post-model');
const uuid = require('uuid/v4');

// GET all blog posts
router.get('/blog-posts', (req, res, next) => {
	listPost.getAll()
		.then(listOfPost => {
			res.status(200).json({
				message: 'Succefully sent the posts',
				status: 200,
				posts: listOfPost
			});
		})
		.catch(err => {
			res.status(500).json({
				message: 'Internal server error',
				status: 500
			});
			next();
		});
});

// GET all posts by author as path parameter
router.get('/blog-posts/:author', (req, res) => {
	let author = req.params.author;
	if (!author) {
		res.status(406).json({
			message: "Missing param 'author'",
			status: 406
		});
	}

	listPost.getByAuthor(author)
		.then(listOfPost => {
			if (listOfPost.length != 0) {
				res.status(200).json({
					message: 'Author found',
					status: 200,
					listOfPosts: listOfPost
				});
			} else {
				res.status(404).json({
					message: 'Author not found',
					status: 404
				});
			}
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				message: 'Internal server error',
				status: 500
			});
			next();
		});
});

// POST
router.post('/blog-posts', (req, res, next) => {
	// Validate all fields are sent in body
	let reqFields = ['title', 'content', 'author', 'publishDate'];
	for (i in reqFields) {
		let currentField = reqFields[i];

		if (!(currentField in req.body)) {
			res.status(406).json({
				message: `Missing field '${currentField}' in body.`,
				status: 406
			});
			next();
		}
	}

	// Create new post to add and push it to array
	let newPost = {
		id: uuid(),
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	}

	listPost.postNew(newPost)
		.then(newPost => {
			res.status(201).json({
				message: 'Succesfully POST',
				status: 201,
				newPost: newPost
			});
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				message: 'Internal server error',
				status: 500
			});
			next();
		});
});


// DELETE post by ID
router.delete('/blog-posts/:id', (req, res) => {

	if (!('id' in req.body)) {
		res.status(406).json({
			message: 'Missing id field',
			status: 406
		});
	}

	let postId = req.params.id;
	if (postId) {
		if (postId == req.body.id) {
			listPost.deletePost(postId)
				.then(deletedPost => {
					res.json({
						message: 'Succesfully deleted',
						status: 204,
						post: deletedPost
					}).status(204)
				})
				.catch(err => {
					res.status(404).json({
						message: 'Post not found',
						status: 404
					});
				})
		} else {
			res.status(400).json({
				message: 'Parameters do not match',
				status: 400
			});
		}
	} else {
		res.status(406).json({
			message: 'Missing id in parameters',
			status: 406
		});
		next();
	}
});

// PUT update post - update
router.put('/blog-posts/:id', (req, res, next) => {
	let id = req.params.id;
	let postObj = req.body;

	if (id) {
		if (Object.keys(postObj).length == 4) {
			listPost.updatePost(id, postObj)
				.then(postUpdated => {
					res.status(200).json({
						message: 'Post updated',
						status: 200,
						post: postUpdated
					});
				})
				.catch(err => {
					console.log(err);
					res.status(404).json({
						message: 'Post not found',
						status: 404,
						error: err
					});
				})
		} else {
			res.status(404).json({
				message: 'Missing body parameters',
				status: 404
			});
		}
	} else {
		res.status(406).json({
			message: 'Missing id in parameters',
			status: 406
		});
	}
});

module.exports = router;