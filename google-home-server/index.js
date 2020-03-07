const port = 80;
const hostname = '127.0.0.1';

let User = require('./mongoose/UserController');
let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
    console.log("hello");
});

app.get('/createUser/:userName', async function (req, res) {
    const userName = req.params.userName;
    let user = await User.create(userName);

    res.status(200).send({apiKey: user.apiKey});
   
});

app.get('/addDevice/:deviceName', async function (req, res){
    const deviceName = req.params.deviceName;
    let newUser = await User.addDevice(deviceName, "nnL6ljhsnaxJWs6kuU5bKO9fc9lyVGZmGQ4ts64Q/8C55hAL+3J600BQO/0QaMF0d2lfwdG3cpIMH3e3c4Mzbg==");

    res.status(200).send(newUser);
});
  
app.get('/fanOff', function (req, res){
    fanOn = -1;
});




