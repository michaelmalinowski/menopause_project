# Menopause Wrist Device and Server

A device for measuring the temperature and heartrate using the MAX30105 heartrate sensor and the ds18b20 temperature sensor.
The code is meant to be used on a ESP8266 board but may be compatiable with other boards.

Two example devices are provided (Fan and Light) to demonstrate functionality of the server paired with the wrist device.

##Getting Started
The google home server should be upload for this to project to work. A temporary server will be running until July 30th 2020
*http://34.66.131.1/ 

Start by creating a user and using your api key to perform different actions such as creating devices and adding 
characteristic. Characteristics can be updated as well to control aspects of a device. With all devices setup correctly, the
wrist device can control any device from anywhere. 

## API Calls

/createUser 
Params:
@userName

@returns apiKey

/addDevice
Params:
@apiKey 
@deviceName

@returns boolean

/removeDevice
Params:
@apiKey 
@deviceName

@returns boolean

/getDevices
Params:
@apiKey 

@returns [devices]


/addCharacteristic
Params:
@apiKey 
@deviceName
@characteristic
@value

@returns boolean

/getCharacteristic
Params:
@apiKey 
@deviceName
@characteristicName

@returns characteristic

/removeCharacteristic
Params:
@apiKey 
@deviceName
@characteristicName

@returns boolean

/updateCharacteristic
Params:
@apiKey 
@deviceName
@characteristic
@value

@returns boolean

