const http = require("http");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const env = require("dotenv").config();
const randomColor = require('randomcolor');
const strip_tags = require('locutus/php/strings/strip_tags')
const uuid = require("uuid-random");

// purge messages older than (in milliseconds)
const forget_time = 60 * 60 * 1000
// frontend location for debugging
const frontEndLoc = path.join(__dirname, "..", "frontend", "dist");

let users = {}
let messages = []

const deleteOldMessages = function(messages) {
  while (messages.length > 0 && new Date() - messages[0].date > forget_time) {
    messages.shift()
  }
}

// setup express app
const app = express()
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use(express.static(frontEndLoc));

// start server
const server = http.createServer(app)
server.listen(process.env.PORT || 3000);

// setup sockets
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
  path: "/ws/"
});

io.on("connection", socket => {
  console.log('connect #' + socket.id + " from " + socket.client.conn.remoteAddress);

  deleteOldMessages(messages)

  io.to(socket.id).emit("your-id", { id: socket.id })
  io.to(socket.id).emit("history", { users, messages })

  socket.on("join", function(user_data) {
    users[socket.id] = user_data
    users[socket.id].id = socket.id
    users[socket.id].color = randomColor({ luminosity: 'bright' })
    users[socket.id].datetime = new Date()
    socket.broadcast.emit("joined", users[socket.id])
  });

  socket.on("message", function(msg_data) {
    msg_data.user_id = socket.id
    msg_data.id = uuid()
    msg_data.msg = strip_tags(msg_data.msg)
    msg_data.color = users[socket.id].color
    msg_data.date = new Date()
    messages.push(msg_data)
    io.emit("message", msg_data)
    deleteOldMessages(messages)
  });

  socket.on("moved", function(user_data) {
    users[socket.id] = user_data
    socket.broadcast.emit("moved", user_data);
  });

  socket.on("disconnect", function(user_data) {
    console.log("disconnect #" + socket.id);
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id]
  });
});
