'use strict'
const fetch = require("node-fetch")

exports.sleepMs = async function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function innerFetch(url, json, headers = []){
    var method = "GET"
    var myHeaders = new fetch.Headers()
    myHeaders.set("Accept", "application/json")
    myHeaders.set("Content-Type", "application/json")
    if (headers != null) {
        headers.map(header => myHeaders.set(header.key, header.value))
    }
    const options = {
        method: method,
        headers: myHeaders,
        body: json
    }
    return fetch(url, options)
}

async function innerPost(url, json, headers = []){
    var method = "POST"
    var myHeaders = new fetch.Headers()
    myHeaders.set("Accept", "application/json")
    myHeaders.set("Content-Type", "application/json")
    if (headers != null) {
        headers.map(header => myHeaders.set(header.key, header.value))
    }
    const options = {
        method: method,
        headers: myHeaders,
        body: json
    }
    return fetch(url, options)
}

exports.fetchAsText = async function (url, json, headers = []) {
    return innerFetch(url, json, headers)
        .then(response => response.text())
}

exports.fetchAsJson = async function (url, json, headers = []) {
    return innerFetch(url, json, headers)
        .then(response => response.json())
}

exports.postAsJson = async function (url, json, headers = []) {
    return innerPost(url, json, headers)
        .then(response => response.json())
}
