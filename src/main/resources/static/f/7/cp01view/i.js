'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { mcDataMethods, adnIds, adn, initDomConfLogic, domConfCP, } from
    '/f/7/libDomGrid/libDomGrid.js'
initDomConfLogic(window.location.hash.substring(1))
console.log(domConfCP())

import { initSelectMaker } from '/f/7/libDbRw/libSqlMaker.js'
import { readOntologyTree } from '/f/7/libDbRw/libMcRDb.js'
import { ws, executeSelectQuery } from '/f/7/libDbRw/wsDbRw.js'
ws.onopen = event => readOntologyTree(domConfCP().l, afterReadCP)

const afterReadCP = () => {
    getDomComponent('cp01view').count++
    console.log(adnIds())
    const r2List = adnIds().reduce((l, i) => adn(i).r2 && l.push(adn(i).r2) && l || l, [])
    console.log(r2List)
    readOntologyTree(r2List, afterReadR2)
}

const selectOnBasedOnMaker = initSelectMaker('selectOnBasedOn', 'doc')
    .initColumns('doc_id').initLeftJoin(
        '(SELECT doc_id basedon_id FROM doc WHERE reference=2014) x', 'reference=basedon_id')
    .initWhere('reference2 IN (:idList)').andWhere('reference!=2008') //Encounter.basedOn

const afterReadR2 = () => {
    getDomComponent('cp01view').count++
    console.log('find basedOn this CarePlan?')
    const sql = selectOnBasedOnMaker.get().replace(':idList', domConfCP().l.join(','))
    // console.log(sql)
    executeSelectQuery(sql).then(json => {
        const parentIds = json.list.reduce((l, o) => l.push(o.doc_id) && l, [])
        domConfCP().basedOnCP = parentIds
        // console.log(parentIds, json)
        readOntologyTree(parentIds, afterBasdOn)
    })
}
const afterBasdOn = (x, deepCount) => {
    console.log(x, deepCount, mcDataMethods.mcData())
    getDomComponent('cp01view').count++
}

import { cpSymbolR } from '/f/7/cp01view/libCP.js'
import { setDomComponent, getDomComponent } from '/f/7/libDomGrid/libDomGrid.js'
const { createApp } = Vue
createApp({
    data() { return { count: 0, rootId: domConfCP().l[0] } },
    mounted() { setDomComponent('cp01view', this) }, methods: Object.assign({
        basedOnCP: () => domConfCP().basedOnCP
    }, mcDataMethods, cpSymbolR)
}).mount('#cp01view')
