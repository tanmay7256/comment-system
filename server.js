// const { info } = require('console');
// require('dotenv').config()
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const port = 8080;

app.use(express.static(__dirname + "/public"))
http.listen(port, () => {
    console.log(`listening on port ${port}`);
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})
//connecting with mongodb
const dbconnect = require('./db.js')
dbconnect();

const comment = require("./models/comment")
app.use(express.json())

app.post('./api/comment', (req, res) => {
    const comment = new comment({
        username: req.body.username,
        comment: req.body.comment
    })
    comment.save().then(response => {
        res.send(response);
    })
})

const io = require('socket.io')(http);
io.on('connection', (socket) => {
    console.log(`New Connction:${socket.id}`)
    //broadcast
    socket.on('comment', (info) => {
        info.time = Date();
        socket.broadcast.emit('comment', info);
    })
    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username);
    })
})
