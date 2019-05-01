const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const blogPostRouter = require('./blog-post-router');
const app = express();
mongoose.Promise = global.Promise;
const jsonParser = bodyParser.json();

app.use(express.static('public'));

app.use('/', jsonParser, blogPostRouter);

let server;

function runServer(port, databaseUrl) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl,
			err => {
				if (err) {
					return reject(err);
				} else {
					server = app.listen(port, () => {
						console.log("App is Running in port", port);
						resolve();
					})
						.on('error', err => {
							mongoose.disconnect();
							return reject(err);
						});
				}
			}
		);
	});
}

function closeServer() {
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing server');
				server.close(err => {
					if (err) {
						return reject(err);
					} else {
						resolve();
					}
				});
			});
		});
}

runServer(8080, 'mongodb://localhost/renato-blog-post')
	.catch(err => console.log(err));

module.exports = { app, runServer, closeServer };