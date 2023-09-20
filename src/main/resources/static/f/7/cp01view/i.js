'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import {
    initDomConfLogic, domConfCP, mcDataMethods
    , getDomComponent, setDomComponent
    , adnIds, adn
} from '/f/7/libDomGrid/libDomGrid.js'
initDomConfLogic(window.location.hash.substring(1))
console.log(domConfCP())

import { initSelectMaker } from '/f/7/libDbRw/libSqlMaker.js'
const selectOnBasedOnMaker = initSelectMaker('selectOnBasedOn', 'doc')
    .initLeftJoin('(SELECT doc_id basedon_id FROM doc WHERE reference=2014) x'
        , 'reference=basedon_id')
    .initWhere('reference2 IN (:idList)')
    .andWhere('reference!=2008') //Encounter.basedOn
    .initColumns('doc_id')


import { readAdnByIds, deepN_readParent } from '/f/7/libDbRw/libMcRDb.js'
import { ws, executeSelectQuery } from '/f/7/libDbRw/wsDbRw.js'
ws.onopen = event => domConfCP().l.length && readAdnByIds(domConfCP().l)
    .then(() => deepN_readParent(6, domConfCP().l, [], afterReadCP))

const afterReadCP = (x, deepCount) => {
    getDomComponent('cp01view').count++
    console.log(adnIds())
    const r2List = adnIds().reduce((l, i) => adn(i).r2 && l.push(adn(i).r2) && l || l, [])
    console.log(r2List)
    r2List.length && readAdnByIds(r2List)
        .then(() => deepN_readParent(6, r2List, [], afterReadR2))
}
const afterReadR2 = (x, deepCount) => {
    getDomComponent('cp01view').count++
    console.log('find basedOn this CarePlan?')
    const sql = selectOnBasedOnMaker.get().replace(':idList', domConfCP().l.join(','))
    // console.log(sql)
    executeSelectQuery(sql).then(json => {
        const parentIds = json.list.reduce((l, o) => l.push(o.doc_id) && l, [])
        domConfCP().basedOnCP = parentIds
        console.log(parentIds)
        readAdnByIds(parentIds)
            .then(() => deepN_readParent(2, parentIds, [], afterBasdOn))
    })
}
const afterBasdOn = (x, deepCount) => {
    console.log(x, deepCount, mcDataMethods.mcData())
    getDomComponent('cp01view').count++

}

import { cpSymbolR } from '/f/7/cp01view/libCP.js'
const { createApp } = Vue
createApp({
    data() { return { count: 0, rootId: domConfCP().l[0] } },
    mounted() { setDomComponent('cp01view', this) }, methods: Object.assign({
        basedOnCP:()=>domConfCP().basedOnCP
    }, mcDataMethods, cpSymbolR)
}).mount('#cp01view')