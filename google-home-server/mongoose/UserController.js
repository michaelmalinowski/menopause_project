let User = require('./dbconnect');
let crypto = require('crypto');

class Characteristic {
    constructor(property, value){
        this.property = property;
        this.value = value;
    }
}

class Device {
    constructor(id, name){
        this.id = id;
        //This name should be unique
        this.name = name;
        this.characteristics = [];
    }

    addCharacteristic(characteristic){
        this.characteristics.push(characteristic);
    }

    removeCharacteristic(name){
        return this.characteristics.map(function(item){
            if (item.name !== name){

                return item;
            }
        });
    }
    
    getCharacteristic(property){
        for(let i = 0; i < this.characteristics.length - 1; ++i){
            if (this.characteristics[i].property === property){

                return this.characteristics[i].value;
            }
        }

        return "Characteristic does not exist";
    }
}

class UserController {
    //returns an user object
    async create(userName){
        let newUser;
        let buf = crypto.randomBytes(64).toString('base64');
        let user = new User({name: userName, apiKey: buf})
        newUser = await user.save();

        return newUser;
    }

    //returns am authenicated user
    async authenticatedUser(apiKey){
        let user = await User.findOne({apiKey: apiKey}).exec();

        return user;
    }

    //returns an id of the device
    async addDevice(name, apiKey){
        let user = await this.authenticatedUser(apiKey);
        console.log(user);
        
        let device = new Device(name, user.devices.length + 1);
        user.devices.push(device);
        let success = await user.save();
        console.log(success);
        
        return success;
    }
    //returns a list of devices and their characteristics
    getDevices(){

    }
    //returns an id
    getDevice(){

    }
    //returns an id for the characteristic
    addCharacteristic(){

    }
    //return the characteristics value
    getCharacteristic(){

    }
    //returns a boolean
    updateCharacteristicValue(){

    }
}

module.exports = new UserController;