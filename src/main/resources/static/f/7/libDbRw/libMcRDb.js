'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { initNewMc, reViewAdn } from '/f/7/libDomGrid/libDomGrid.js'
import {
    executeSelectQuery, executeAdnInsertQuery, executeDeleteAdn1Query,
    executeUpdateString
} from './wsDbRw.js'
/**
 * 
 * @param {*} adnJson 
 * @returns 
 */
export const dbSendVlStrData = adnJson => executeUpdateString(adnJson).then(json => {
    mcData.eMap[json.adnId].vl_str = json.string
    reViewAdn(json.adnId)
})

export const dbSendInsertAdn = adnJson => {
    console.log(adnJson, 123)
    return executeAdnInsertQuery(adnJson).then(json => {
        console.log(json, 123)
        json.d.p = json.d.parent
        json.d.r = json.d.reference
        json.d.r2 = json.d.reference2
        console.log(json)
        mcData.eMap[json.d.doc_id] = json.d
        mcData.parentChilds[json.d.p].push(json.d.doc_id)
        reViewAdn(json.d.p)
    })
}

export const dbSendDeleteAdn1 = adnJson => executeDeleteAdn1Query(adnJson).then(json => {
    delete mcData.eMap[json.adnId]
    mcData.parentChilds[json.p] =
        mcData.parentChilds[json.p].filter(k => k != json.adnId)
    console.log(json.adnId, json.p)
    reViewAdn(json.p)
})
/**
 * 
 * @param {*} id_list 
 * @returns 
 */
export const readAdnByIds = id_list => {
    const sql = selectDocVlStrByIds.replace(':idList', id_list.join(','))
    return executeSelectQuery(sql).then(json => initNewMc(json.list)
    ).then(() => {
        console.log('read rr2', id_list)
    })
}
/**
 * 
 * @param {*} adnList 
 * @returns 
export const addToParentChild = adnList => adnList.reduce((pl, adn) =>
    !(mcData.parentChilds[adn.p] || (mcData.parentChilds[adn.p] = [])
    ).includes(adn.p) &&
    (mcData.parentChilds[adn.p].push(adn.doc_id) && pl.push(adn.p))
    && pl || pl, [])
 */

import { addNewMc, } from '/f/7/libDomGrid/libDomGrid.js'
/**
 * 
 * @param {*} parentId_list 
 */
export const readAdnByParentIds = parentId_list => {
    const sql = selectDocVlStrByParentIds.replace(':idList', parentId_list.join(','))
    // console.log(parentId_list)
    return executeSelectQuery(sql).then(json => {
        !json.list.length && parentId_list.forEach(andId =>
            mcData.parentChilds[andId] = [])
        addNewMc(json.list)
        const pl2 = json.list.reduce((o, im) =>
            (o[im.p] || (o[im.p] = [])).push(im.doc_id) && o, {})
        Object.keys(pl2).forEach(p => mcData.parentChilds[p] = pl2[p])
    })
}

import { initSelectMaker } from './libSqlMaker.js'
import { mcData } from '../libDomGrid/libDomGrid.js'
const selectDocVlStrMaker = initSelectMaker('selectDocVlStr', 'doc')
    .initLeftJoin('string', 'doc_id=string_id')
    .initColumns('doc_id, parent p, reference r, reference2 r2, value vl_str')

/**
 * 
 */
const selectDocVlStrByIds = selectDocVlStrMaker
    .initWhere('doc_id IN (:idList)').get()

/**
 * 
 */
const selectDocVlStrByParentIds = selectDocVlStrMaker
    .initWhere('parent IN (:idList)')
    .addLeftJoin('sort', 'doc_id=sort_id')
    .initOrder('sort')
    .get()

