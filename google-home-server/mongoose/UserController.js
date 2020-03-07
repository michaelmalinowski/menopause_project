let User = require('./dbconnect');
let crypto = require('crypto');

class Characteristic {
    constructor(property, value){
        this.property = property;
        this.value = value;
    }
}

class Device {
    constructor(name, characteristics=[]) {
        //This name should be unique
        this.name = name;
        this.characteristics = characteristics;
    }

    async addCharacteristic(newCharacteristic){
        for await (let characteristic of this.characteristics){       
            if (characteristic.property === newCharacteristic.property){
                
                return "Characteristic aleady exists";
            }
        }
        this.characteristics.push(newCharacteristic);

        return true
    }

    async updateCharacteristicValue(property, value){
        let counter = 0;
        for await (let characteristic of this.characteristics){       
            if (characteristic.property === property){
                this.characteristics[counter].value = value;

                return true;
            }
            ++counter;
        }

        return "Characteristic does not exist";
    }
    removeCharacteristic(name){
        return this.characteristics.map(function(item){
            if (item.name !== name){

                return item;
            }
        });
    }
    
    async getCharacteristic(property){
        for await (let characteristic of this.characteristics){
            if (characteristic.property === property){

                return characteristic.value;
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
        buf = buf.replace(/\+/g, '');
        
        let user = new User({name: userName, apiKey: buf})
        newUser = await user.save();

        return newUser;
    }

    //returns am authenicated user
    async authenticatedUser(apiKey){
        let user = await User.findOne({apiKey: apiKey}).exec();
        
        if (user === null) {
            return false;
        }
        return user;
    }

    //returns an id of the device
    async addDevice(apiKey, name){
        let user = await this.authenticatedUser(apiKey);
        if (user === false) {
            
            return "User not found";
        }
        
        let device = new Device(name);
        
        user.devices.push(device);
        
        let success = await user.save();
        
        return success;
    }
    //returns a list of devices and their characteristics
    async getDevices(apiKey){
        let user = await this.authenticatedUser(apiKey);
        
        if (user === false) {

            return "User not found";
        }

        return user.devices; 
    }
    //returns an id
    async getDevice(apiKey, deviceName){
        let user = await this.authenticatedUser(apiKey);
        if (user === false) {

            return "User not found";
        }

        for (let i = 0; i < user.devices.length; ++i) {
            if (deviceName === user.devices[i].name) {

                return user.devices[i];
            }
        }

        return "Device not found";
    }
    //returns an id for the characteristic
    async addCharacteristic(apiKey, deviceName, characteristicName, value){
        let user = await this.authenticatedUser(apiKey);
        if (user === false) {

            return "User not found";
        }
        
        let characteristic = new Characteristic(characteristicName, value);
        
        let counter = 0;
        for await (let device of user.devices) {            
            
            if (device.name === deviceName) {
                let selectedDevice = new Device(device.name, device.characteristics)
                let addCharacteristic = await selectedDevice.addCharacteristic(characteristic);
                if (addCharacteristic === true) {
                    user.devices[counter] = selectedDevice;
                    
                    let success = await user.save();
                    
                    return true;
                };

                return addCharacteristic;
            }
            ++counter;
        }
        
        return 'Device not found'
    }
    //return the characteristics value
    async getCharacteristic(apiKey, deviceName, characteristicName){
        let user = await this.authenticatedUser(apiKey);
        
        if (user === false) {

            return "User not found";
        }
        
        for (let i = 0; i < user.devices.length; ++i) {
            if (user.devices[i].name === deviceName) {
                let device = new Device(user.devices[i].name, user.devices[i].characteristics);
                let success = await device.getCharacteristic(characteristicName);
                
                return success;
            }
        }

        return "Device not found";
    }
    //returns a boolean
    async updateCharacteristicValue(apiKey, deviceName, characteristicName, value){
        let user = await this.authenticatedUser(apiKey);
        if (user === false) {

            return "User not found";
        }

        let counter = 0;
        for await (let device of user.devices) {
            if (device.name === deviceName) {
                let updateDevice = new Device(device.name, device.characteristics);
                let success = await updateDevice.updateCharacteristicValue(characteristicName, value);
                if(success === true) {
                    user.devices[counter] = updateDevice;
                    await user.save();
                }
                
                return success;
            }
            ++counter;
        }
        
        return "Device not found";
    }
}

module.exports = new UserController;