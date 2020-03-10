const port = 80;
const hostname = '0.0.0.0';

let User = require('./mongoose/UserController');
var bodyParser = require('body-parser');
let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/', async function (req, res) {    


    res.status(200).send("Hello from google-menopause server");
});

app.post('/createUser', async function (req, res) {    
    const userName = req.query.userName;

    let user = await User.create(userName);

    res.status(200).send({apiKey: user.apiKey});
});

app.post('/addDevice', async function (req, res) {  
    const apiKey = req.query.key;
    const deviceName = req.query.deviceName;
    
    let newUser = await User.addDevice(apiKey, deviceName);
    res.status(200).send(newUser);
});

app.get('/getDevices', async function (req, res) {
    const apiKey = req.query.key;
    
    let devices = await User.getDevices(apiKey);

    res.status(200).send(devices);
});

app.post('/addCharacteristic', async function (req, res) {
    const apiKey = req.query.key;
    const deviceName = req.query.deviceName;
    const characteristic = req.query.characteristic;
    const value = req.query.value;

    let devices = await User.addCharacteristic(apiKey, deviceName, characteristic, value);

    res.status(200).send(devices);
});

app.get('/getCharacteristic', async function (req, res) {
    const apiKey = req.query.key;
    const deviceName = req.query.deviceName;
    const characteristic = req.query.characteristic; 

    let characteristicValue = await User.getCharacteristic(apiKey, deviceName, characteristic);

    res.status(200).send(characteristicValue);
});

app.post('/updateCharacteristic', async function (req, res) {
    const apiKey = req.query.key;
    const deviceName = req.query.deviceName;
    const characteristic = req.query.characteristic;
    const value = req.query.value;

    let success = await User.updateCharacteristicValue(apiKey, deviceName, characteristic, value);

    res.status(200).send(success);
});

app.get('/fanOff', function (req, res){
    fanOn = -1;
});




