'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * WebSocket and its DB API logic
 */

const uri_wsDbRw = "ws://" + window.location.host + "/dbRw"
export const ws = new WebSocket(uri_wsDbRw)

/**
 * 
 * @param {*} dbMessage 
 * @returns 
 */
export const executeUpdateString = dbMessage =>
    (dbMessage.cmd = 'updateString') && execute_SqlChange_API(dbMessage)

/**
 * 
 * @param {*} dbMessage 
 * @returns 
 */
export const executeAdnInsertQuery = dbMessage =>
    (dbMessage.cmd = 'insertAdn') && execute_SqlChange_API(dbMessage)

/**
 * 
 * @param {*} dbMessage 
 * @returns 
 */
export const executeDeleteAdn1Query = dbMessage =>
    (dbMessage.cmd = 'deleteAdn1') && execute_SqlChange_API(dbMessage)

/**
 * 
 * @param {*} dbApiMessage 
 * @returns 
 */
const execute_SqlChange_API = dbApiMessage => {
    // addDbMessageToPool(dbApiMessage)
    console.log(dbApiMessage)
    return execute_SQL_API(dbApiMessage)
}

/**
 * Execute SQL SELECT query
 * @param {*} sql 
 * @returns results row list
 */
export const executeSelectQuery = sql => execute_SQL_API({ sql: sql, cmd: 'executeQuery' })

/**
 * Execute some SQL with WebSocket API from REST: /dbRw
 * @param {*} sqlApi 
 * @returns result
 */
export const execute_SQL_API = sqlApi => {
    ws.send(JSON.stringify(sqlApi))
    return new Promise((thenFn, reject) => ws.onmessage = event => thenFn(JSON.parse(event.data)))
}