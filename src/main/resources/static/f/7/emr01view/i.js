'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import {
    initDomConfLogic, domConfEMR, mcDataMethods, parentChilds
    , getDomComponent, setDomComponent
    , adn, adnIds, domConstants
} from '/f/7/libDomGrid/libDomGrid.js'
moment.locale('uk')

import { executeSelectQuery } from '/f/7/libDbRw/wsDbRw.js'
initDomConfLogic(window.location.hash.substring(1))
console.log(domConfEMR())
import { readAdnByIds, deepN_readParent } from '/f/7/libDbRw/libMcRDb.js'
import { ws } from '/f/7/libDbRw/wsDbRw.js'
ws.onopen = event => domConfEMR().l.length && readAdnByIds(domConfEMR().l)
    .then(() => deepN_readParent(6, domConfEMR().l, [], afterReadEMR))

const isEmrData = adnId =>
    domConstants.EpisodeOfCareIds.includes(mcDataMethods.adn(adnId).r)
    || domConstants.EncounterIds.includes(mcDataMethods.adn(adnId).r)

const afterReadEMR = () => {
    getDomComponent('emr01view').count++
    const emrR2DataList = adnIds().reduce((l, i) => isEmrData(i)
        && l.push(mcDataMethods.adn(i).r2) && l || l, [])
    emrR2DataList.length && readAdnByIds(emrR2DataList)
        .then(() => deepN_readParent(6, emrR2DataList, [], afterReadEmrR2Data))
}

const afterReadEmrR2Data = (x, deepCount) => {
    console.log(x, deepCount, mcDataMethods.mcData())
    getDomComponent('emr01view').count++
    const sql = 'SELECT timestamp_id, value::timestamp as ts FROM timestamp WHERE timestamp_id IN (:ids)'
        .replace(':ids', adnIds().join(','))
    console.log(sql, adnIds())
    executeSelectQuery(sql).then(json => {
        console.log(json)
        json.list.forEach(tso => {
            adn(tso.timestamp_id).ts = tso.ts
            console.log(tso.timestamp_id, adn(tso.timestamp_id), tso
                , moment(tso.ts).format('lll'))
        })
        getDomComponent('emr01view').count++
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
        moment_lll: adnId => moment(adn(adnId).ts).format('lll'),
    }, mcDataMethods, emrSymbolR)
})
emr01view.mount('#emr01view')
