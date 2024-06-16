const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);
const activeUsers = new Map();

app.get("/", (req, res) => {
	res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
	console.log("user connected to socket");

	socket.on("active users", (msg) => {
		activeUsers.set(socket.id, msg);
		const list = []

		activeUsers.forEach((value, key, map) => {
			list.push(value)
		})

		io.emit("active users", list);
	});

	socket.on("chat message", (msg) => {
		console.log("chat message: " + msg);
		io.emit("chat message", msg);
	});

	socket.on("disconnect", (msg) => {
		console.log("user disconnected from socket");
		activeUsers.delete(socket.id);
	});
});

server.listen(3000, () => {
	console.log("server running at http://localhost:3000");
});
