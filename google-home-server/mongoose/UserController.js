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
              
            if (characteristic.property === newCharacteristic.property && characteristic.property !== undefined){
                
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
    async removeCharacteristic(characteristicName){
        let counter = 0;
        for await (let characteristic of this.characteristics){
            if (characteristic.property === characteristicName){
                this.characteristics.splice(counter, 1);
                return true;
            }
            ++counter;
        }

        return "Characteristic does not exist";
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

        return {apiKey: buf};
    }

    //returns an authenicated user
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
        for await (let device of user.devices) {
            if (device.name === name) {
                return "Device already exists";
            }
        }

        let device = new Device(name);
        
        user.devices.push(device);
        
        await user.save();
        
        return "Device has been added";
    }
    //returns a list of devices and their characteristics
    async getDevices(apiKey){
        let user = await this.authenticatedUser(apiKey);
        
        if (user === false) {

            return "User not found";
        }

        return user.devices; 
    }

    async removeDevice(apiKey, deviceName){
        let user = await this.authenticatedUser(apiKey);
        
        if (user === false) {

            return "User not found";
        }
        let counter = 0;
        for await (let device of user.devices) {
            if (device.name === deviceName) {
                user.devices.splice(counter, 1);
                let success = await user.save();
                return "Device removed";
            }
            ++counter;
        }
       return "Device not found";
    }

    //returns an id for the characteristic
    async addCharacteristic(apiKey, deviceName, characteristicName, value){
        let user = await this.authenticatedUser(apiKey);
        if (user === false) {
            return "User not found";
        }

        if (characteristicName === undefined || value === undefined){
            return "Error";
        }

        if (characteristicName === "" || value === "") {
            return "Missing Info";
        }

        let characteristic = new Characteristic(characteristicName, value);
        
        let counter = 0;
        for await (let device of user.devices) {            
            
            if (device.name === deviceName) {
                let selectedDevice = new Device(device.name, device.characteristics);
                
                let addCharacteristic = await selectedDevice.addCharacteristic(characteristic);
                if (addCharacteristic === true) {
                    user.devices[counter] = selectedDevice;
                    
                    let success = await user.save();
                    
                    return "Characteristic added";
                };

                return addCharacteristic;
            }
            ++counter;
        }
        
        return 'Device not found';
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

    async removeCharacteristicValue(apiKey, deviceName, characteristicName){
        let user = await this.authenticatedUser(apiKey);
        if (user === false) {

            return "User not found";
        }

        let counter = 0;
        for await (let device of user.devices) {
            if (device.name === deviceName) {
                let updateDevice = new Device(device.name, device.characteristics);
                let success = await updateDevice.removeCharacteristic(characteristicName);
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