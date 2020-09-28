'use strict'

class StartedAt{
    constructor(){
        this.message = `Started at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
    }

    get(){
        return this.message
    }
}

module.exports = StartedAt
