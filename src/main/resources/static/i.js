'use strict'
const uri_test01 = "ws://" + window.location.host + "/test01"
console.log(uri_test01)
const ws = new WebSocket(uri_test01)

const testJson = { x: 1, y: 3 }
testJson.sql = 'SELECT doc_id, parent p, reference r, reference2 r2, value vl_str, sort FROM doc \n\
LEFT JOIN string ON doc_id=string_id \n\
LEFT JOIN sort ON doc_id=sort_id \n\
WHERE  376632 IN (doc_id,parent)'

ws.onopen = event1 => {
    ws.send(JSON.stringify(testJson))
    // ws.send({ x: 1, y: 2 })
    return new Promise((thenFn) => ws.onmessage = event => thenFn(event)
    ).then(event => {
        console.log(event, 123)
        const json = JSON.parse(event.data)
        console.log(JSON.stringify(json, '', 2))
        console.log(json.sql)
    })
}

(await fetch('./rs01')).json().then(json => {
    console.log(json, 123)
})
