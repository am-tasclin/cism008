'use strict'
const uri_test01 = "ws://" + window.location.host + "/test01"
console.log(uri_test01)
const ws = new WebSocket(uri_test01)

ws.onopen = event1 => {
    ws.send(JSON.stringify({ x: 1, y: 2 }))
    // ws.send({ x: 1, y: 2 })
    return new Promise((thenFn) => ws.onmessage = event => thenFn(event)
    ).then(event => {
        console.log(event, 123)
        console.log(event.data, 234)
    })
}
