'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import {
    initDomConfLogic, mcData,
    setDomComponent, getDomComponent
} from '/f/7/libDomGrid/libDomGrid.js'
import { readAdnByIds, readAdnByParentIds } from '/f/7/libDbRw/libMcRDb.js'

// console.log(window.location.hash.substring(1))
const domConf = initDomConfLogic(window.location.hash.substring(1))
const uniqueIdsForDbRead = domConf.wf.l
console.log(domConf, uniqueIdsForDbRead)

import { ws } from '/f/7/libDbRw/wsDbRw.js'
ws.onopen = event =>
    uniqueIdsForDbRead.length && readAdnByIds(uniqueIdsForDbRead
    ).then(() => deepN_readParent(6, uniqueIdsForDbRead, afterDeepN))

const afterDeepN = x => {
    console.log(123, x)
    console.log(mcData)
}

const deepN_readParent = (deepCount, list, fn) => {
    // console.log(deepCount, list, list.length)
    deepCount == 0 && fn(list)
    deepCount > 0 && list.length && readAdnByParentIds(list).then(() => {
        getDomComponent('workFlow').count++
        const newList = Object.keys(mcData.eMap).filter(i => !mcData.parentChilds[i])
        // console.log(deepCount, newList, newList.length)
        deepN_readParent(--deepCount, newList, fn)
    })
}

const { createApp } = Vue
createApp({
    data() { return { count: 0, rootId: domConf.wf.l[0] } },
    mounted() { setDomComponent('workFlow', this) },
    methods: {
        adn(adnId) { return mcData.eMap[adnId] || {} },
        parentChilds(adnId) { return mcData.parentChilds[adnId] || [] },
    }
}).mount('#workFlow')