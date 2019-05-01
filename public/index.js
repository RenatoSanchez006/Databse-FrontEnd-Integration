$(function () {
	getPostListPost();
});

function getPostListPost() {
	$.ajax({
		url: './blog-posts',
		method: "GET",
		dataType: 'json',
		success: responseJson => publishPost(responseJson.posts),
		error: err => postNotFound(err)
	});
}

$('#search').click(function () {
	let author = $('#searchAuthor').val();
	$.ajax({
		url: `./blog-posts/${author}`,
		method: "GET",
		dataType: 'json',
		success: responseJson => publishPost(responseJson.listOfPosts),
		error: err => postNotFound(err)
	});
	$('#searchAuthor').val('');
});

$('#postButton').click(function() {
	let title = $('#postTitle').val();
	let author = $('#postAuthor').val();
	let content = $('#postContent').val();
	let publishDate = $('#postPublishDate').val();  

	let newPost = {
		title: title,
		author: author,
		content: content,
		publishDate: publishDate
	}

	if (validateData(newPost)) {
		$.ajax({
			url: `./blog-posts/`,
			method: "POST",
			contentType: 'application/json',
			data: JSON.stringify(newPost),
			dataType: 'json',
			success: responseJson => addPost(responseJson.newPost),
			error: err => postNotFound(err)
		});
	}
	$('#postTitle').val('');
	$('#postAuthor').val('');
	$('#postContent').val('');
	$('#postPublishDate').val('');
});

$(document).on('click', '.deleteButton', function () {
	let id = $(this).closest('.post-element').attr('id');
	let postToDelete = {
		id: id
	}
	$.ajax({
		url: `./blog-posts/${id}`,
		method: "DELETE",
		contentType: 'application/json',
		data: JSON.stringify(postToDelete),
		dataType: 'json',
		success: responseJson => { 
			console.log(responseJson.post);
			getPostListPost();
		},
		error: err => postNotFound(err)
	});
});

$('#editButton').click(function () {
	let id = $('#editId').val()
	if(id.length == 0) {
		alert("Missing ID");
		return;
	};
	let title = $('#editTitle').val();
	let author = $('#editAuthor').val();
	let content = $('#editContent').val();
	let publishDate = $('#editPublishDate').val();

	let editPost = {
		title: title,
		author: author,
		content: content,
		publishDate: publishDate
	}

	if (validateData(editPost)) {
		$.ajax({
			url: `./blog-posts/${id}`,
			method: "PUT",
			contentType: 'application/json',
			data: JSON.stringify(editPost),
			dataType: 'json',
			success: responseJson => {
				console.log(responseJson.post);
				getPostListPost();
			},
			error: err => postNotFound(err)
		});
	}
	$('#editId').val('');
	$('#editTitle').val('');
	$('#editAuthor').val('');
	$('#editContent').val('');
	$('#editPublishDate').val('');
});

function validateData(data) {
	alertInfo = ["Missing"];
	if (data.title.length == 0) alertInfo.push("title");
	if (data.author.length == 0) alertInfo.push("author");
	if (data.content.length == 0) alertInfo.push("content");
	if (data.publishDate.length == 0) alertInfo.push("publishDate");
	if (alertInfo.length > 1) {
		alert(alertInfo);
		return false;
	} else {
		return true;
	}
}

function publishPost(post) {
	console.log(post);
	$('.post-list').empty();
	post.forEach(element => {
		$('.post-list').append(`
			<div id='${element._id}' class="post-element">
				<h2>${element.title}</h2>
				<h4>By: ${element.author}</h4>
				<p>${element.content}</p>
				<p>${element.publishDate}</p>
				<p>Id: ${element._id}</p>
				<button class="button deleteButton" type="button">Delete</button>
			</div>
		`);
	});
}

function addPost(newPost) {
	console.log(newPost);
	$('.post-list').prepend(`
		<div id='${newPost._id}' class="post-element">
			<h2>${newPost.title}</h2>
			<h4>By: ${newPost.author}</h4>
			<p>${newPost.content}</p>
			<p>${newPost.publishDate}</p>
			<p>Id: ${newPost._id}</p>
			<button class="button deleteButton" type="button">Delete</button>
		</div>
	`);
}

function postNotFound(err) {
	console.log(err);
	$('.post-list').empty();
	$('.post-list').append(`
		<div class="post-element">
			<h2>${err.status}</h2>
			<p>${err.responseJSON.message}</p>
		</div>
	`);
}
