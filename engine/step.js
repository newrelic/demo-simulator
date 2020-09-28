'use strict'

class Step{
    constructor(raw){
        this.raw = raw
    }

    get_raw_copy(){
        var json = JSON.parse(JSON.stringify(this.raw))
        return json
    }

    name(){
        return this.raw["name"]
    }
    
    params(){
        return this.raw["params"]
    }

    isBrowser(){
        return (this.name()!=null && this.name().toLowerCase().indexOf("browser") >= 0)
    }
}

module.exports = Step
