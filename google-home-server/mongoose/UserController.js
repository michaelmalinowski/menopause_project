let UserDb = require('./dbconnect');

class UserController {
    constructor(){
        const user = UserDb;
    }
    hello(){
        console.log('hi');
    }
}

module.exports = new UserController;