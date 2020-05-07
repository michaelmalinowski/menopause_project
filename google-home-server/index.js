const port = 80;
const hostname = '0.0.0.0';

let User = require('./mongoose/UserController');
var bodyParser = require('body-parser');
let express = require('express');
let app = express();
let server = require('http').Server(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/', async function (req, res) {    
    res.status(200).send("Hello from google-menopause server");
});

//Creates a user and returns a apiKey
app.post('/createUser', async function (req, res) {    
    const userName = req.query.userName;

    let user = await User.create(userName);

    res.status(200).send({apiKey: user.apiKey});
});

//Adds a device to the specific user
app.post('/addDevice', async function (req, res) {  
    const apiKey = req.query.key;
    const deviceName = req.query.deviceName;
    
    let status = await User.addDevice(apiKey, deviceName);
    res.status(200).send(status);
});

//Retrieves all devices and info from a specific user
app.get('/getDevices', async function (req, res) {
    const apiKey = req.query.key;
    
    let devices = await User.getDevices(apiKey);

    res.status(200).send(devices);
});

//Removes a device from a specific user
app.post('/removeDevice', async function (req, res) {  
    const apiKey = req.query.key;
    const deviceName = req.query.deviceName;
    
    let status = await User.removeDevice(apiKey, deviceName);
    res.status(200).send(status);
});

//Add a characteristic to a specific device
app.post('/addCharacteristic', async function (req, res) {
    const apiKey = req.query.key;
    const deviceName = req.query.deviceName;
    const characteristic = req.query.characteristic;
    const value = req.query.value;

    let status = await User.addCharacteristic(apiKey, deviceName, characteristic, value);

    res.status(200).send(status);
});

//Retreives a characteristic of a specific device 
app.get('/getCharacteristic', async function (req, res) {
    const apiKey = req.query.key;
    const deviceName = req.query.deviceName;
    const characteristic = req.query.characteristic; 

    let characteristicValue = await User.getCharacteristic(apiKey, deviceName, characteristic);

    res.status(200).send(characteristicValue);
});

//Updates a characteristic of a specific device
app.post('/updateCharacteristic', async function (req, res) {
    const apiKey = req.query.key;
    const deviceName = req.query.deviceName;
    const characteristic = req.query.characteristic;
    const value = req.query.value;

    let status = await User.updateCharacteristicValue(apiKey, deviceName, characteristic, value);

    res.status(200).send(status);
});

//Removes a characteristic of a specific device
app.post('/removeCharacteristic', async function (req, res) {
    const apiKey = req.query.key;
    const deviceName = req.query.deviceName;
    const characteristic = req.query.characteristic;

    let status = await User.removeCharacteristicValue(apiKey, deviceName, characteristic);

    res.status(200).send(status);
});





