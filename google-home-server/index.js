const port = 80;
const hostname = '127.0.0.1';

let User = require('./mongoose/UserController');
let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server);

console.log(User);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});




