'use strict'

class ErrorMessage{
    constructor(message){
        this.Message = message
    }

    json(){
        return JSON.stringify({Message: this.message})
    }
}

module.exports = ErrorMessage