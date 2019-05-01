const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let postSchema = mongoose.Schema({
	id: { type: String, required: true, unique: true },
	title: { type: String, required: true },
	content: {type: String, required: true},
	author: {type: String, required: true},
	publishDate: {type: String, required: true} 
});

let Post = mongoose.model('Post', postSchema);

const listPost = {
	getAll: function () {
		return Post.find()
			.then(posts => {
				return posts;
			})
			.catch(err => {
				throw new Error(err);
			});
	},
	getByAuthor: function (author) {
		return Post.find({author: author})
		.then(listOfPots => {
			return listOfPots;
		})
		.catch(err => {
			throw new Error(err);
		})
	},
	postNew: function (nPost) {
		return Post.create(nPost)
		.then(post => {
			return post;
		})
		.catch(err => {
			throw new Error(err);
		})
	},
	deletePost: function (postId) {
		return Post.findOneAndRemove({_id: postId})
		.then(post => {
			if(post){
				return post;
			}
			throw new Error("Post not found");
		})
		.catch(err => {
			throw new Error(err);
		});
	},
	updatePost: function (id, postObj) {
		return Post.findByIdAndUpdate({_id: id}, {$set:{title: postObj.title, content: postObj.content, author: postObj.author, publishDate: postObj.publishDate}})
		.then(post => {
			return post
		})
		.catch(err =>{
			throw new Error(err);
		});
	}
}

module.exports = { listPost }


// let post = [
// 	{
// 		id: 1,
// 		title: "How to climb for dummies",
// 		content: "Climbing",
// 		author: "Mr. Loro",
// 		publishDate: 'Feb-6-2019'
// 	}, {
// 		id: 2,
// 		title: "How to teach climbing",
// 		content: "Climbing",
// 		author: "Mr. Chuy",
// 		publishDate: 'Feb-19-2019'
// 	}, {
// 		id: 3,
// 		title: "Is it safe to climb?",
// 		content: "Climbing",
// 		author: "Mr. Chuy",
// 		publishDate: 'Mar-13-2019'
// 	}, {
// 		id: 4,
// 		title: "How to set up a route",
// 		content: "Climbing",
// 		author: "Mr. Chuy",
// 		publishDate: 'Mar-7-2019'
// 	}, {
// 		id: 5,
// 		title: "How belay safetly",
// 		content: "Climbing",
// 		author: "Mr. Loro",
// 		publishDate: 'Abr-25-2019'
// 	}
// ]