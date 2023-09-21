'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import {
    initDomConfLogic, domConfEMR, mcDataMethods
    , getDomComponent, setDomComponent
    , adnIds, domConstants
} from '/f/7/libDomGrid/libDomGrid.js'
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
}

import { emrSymbolR } from '/f/7/emr01view/libEMR.js'
const { createApp } = Vue
const emr01view = createApp({
    data() { return { count: 0, rootId: domConfEMR().l[0] } },
    mounted() { setDomComponent('emr01view', this) }, methods: Object.assign({
        isPatientData: adnId => isEmrData(adnId),
    }, mcDataMethods, emrSymbolR)
})
emr01view.mount('#emr01view')
