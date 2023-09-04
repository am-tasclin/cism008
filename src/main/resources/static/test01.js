'use strict'
const uri_test01 = "ws://" + window.location.host + "/dbRw"
console.log(uri_test01)

const testJson = { x: 1, y: 3 ,cmd:"executeQuery"}

testJson.sql = 'SELECT doc_id, parent p, reference r, reference2 r2, value vl_str, sort FROM doc \n\
LEFT JOIN string ON doc_id=string_id \n\
LEFT JOIN sort ON doc_id=sort_id \n\
WHERE  376632 IN (doc_id,parent)';
console.log(testJson.sql.length);
console.log(101, new Date().toISOString());

const ws = new WebSocket(uri_test01)
ws.onopen = event1 =>
    sendReadMessage(testJson).then(json => {
//        console.log(JSON.stringify(json, '', 2))
        console.log(102001, new Date().toISOString(), json);
        const sqlApi = { parent: 376632, cmd: 'insertAdn', }
        sendReadMessage(sqlApi).then(json => {
            console.log(102, new Date().toISOString(), json, json.d.doc_id);
            sendReadMessage({adnId:json.d.doc_id,cmd:"deleteAdn1"}).then(json=>{
                console.log(102, new Date().toISOString(), json);
            })
        })
    })

const sendReadMessage = sendJson => {
    ws.send(JSON.stringify(sendJson))
    return new Promise((thenFn, errorFn) => ws.onmessage = event => thenFn(JSON.parse(event.data)))
}

console.log(101, new Date().toISOString());
false && (await fetch('./sqlSelect02?sql=' + testJson.sql.replace(/\s+/g, ' '))).json().then(json => {
    console.log(json, 1231)
    console.log(103, new Date().toISOString());
})

// (await fetch('./rs01?a=b')).json().then(json =>     console.log(json, 123));

