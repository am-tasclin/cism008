'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import {
    initDomConfLogic, domConfEMR, mcDataMethods, parentChilds,
    adn, adnIds, domConstants, getDomComponent, setDomComponent,
} from '/f/7/libDomGrid/libDomGrid.js'
moment.locale('uk')

import { executeSelectQuery } from '/f/7/libDbRw/wsDbRw.js'
initDomConfLogic(window.location.hash.substring(1))
// console.log(domConfEMR())

import { ws } from '/f/7/libDbRw/wsDbRw.js'
import { readOntologyTree } from '/f/7/libDbRw/libMcRDb.js'
ws.onopen = event => readOntologyTree(domConfEMR().l, afterReadEMR)

const isEmrData = adnId =>
    domConstants.EpisodeOfCareIds.includes(mcDataMethods.adn(adnId).r)
    || domConstants.EncounterIds.includes(mcDataMethods.adn(adnId).r)
    || domConstants.DocumentReferenceIds.includes(mcDataMethods.adn(adnId).r)

const afterReadEMR = () => {
    getDomComponent('emr01view').count++
    const emrR2DataList = adnIds().reduce((l, i) => isEmrData(i)
        && l.push(mcDataMethods.adn(i).r2) && l || l, [])
    readOntologyTree(emrR2DataList, afterReadEmrR2Data)
}

const sql_ts = 'SELECT timestamp_id id, value::timestamp as ts FROM timestamp WHERE timestamp_id IN (:ids)'
const afterReadEmrR2Data = (x, deepCount) => {
    console.log(x, deepCount, mcDataMethods.mcData())
    getDomComponent('emr01view').count++
    // console.log(adnIds(), sql_ts)
    executeSelectQuery(sql_ts.replace(':ids', adnIds().join(','))
    ).then(json => {
        json.list.forEach(tso => adn(tso.id).ts = tso.ts)
        getDomComponent('emr01view').count++
    }).then(() => {
        console.log(1123)
    })
}

import { emrSymbolR } from '/f/7/emr01view/libEMR.js'
const { createApp } = Vue
const emr01view = createApp({
    data() { return { count: 0, rootId: domConfEMR().l[0] } },
    mounted() { setDomComponent('emr01view', this) }, methods: Object.assign({
        isPatientData: adnId => isEmrData(adnId),
        startPeriodChild: adnId => parentChilds(adnId)
            .find(i => '🕘' == emrSymbolR.emrSymbolR(i)),
        momentF: (adnId, f) => moment(adn(adnId).ts).format(f),
        clickErBonCpPd(cpElId) {
            console.log(cpElId, adn(cpElId).r2)
        },
    }, mcDataMethods, emrSymbolR)
})
emr01view.mount('#emr01view')
