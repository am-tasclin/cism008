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
    ).then(() => deepN_readParent(deepNum, uniqueIdsForDbRead, [], afterDeepN))

const afterDeepN = x => {
    console.log(x, mcData)
}

const deepNum = 6
const deepN_readParent = (deepCount, list, prevList, fn) => {
    // console.log(deepCount, list, list.length)
    deepCount == 0 && fn(list)
    deepCount > 0 && list.length && readAdnByParentIds(list).then(() => {
        getDomComponent('workFlow').count++
        getDomComponent('wf01').count++
        list.forEach(i => domConf.wf.wfComponent[i] &&
            domConf.wf.wfComponent[i].count++)
        const newList = Object.keys(mcData.eMap).filter(i => !mcData.parentChilds[i] && !prevList.includes(i))
        // console.log(deepCount, newList, newList.length)
        deepN_readParent(--deepCount, newList, list.concat(newList), fn)
    })
}

const { createApp } = Vue
import WfElement from '/f/7/libWF/WfElement.js'
const wf01 = createApp({
    data() { return { count: 0, rootId: domConf.wf.l[0] } },
    mounted() { setDomComponent('wf01', this) }, methods: {
        adn(adnId) { return mcData.eMap[adnId] || {} },
    }, template: `
<h2 :review="count"> {{adn(rootId).vl_str}} </h2>
<t-wf :adnid="rootId"></t-wf>
`,
})
wf01.component('t-wf', WfElement)
wf01.mount('#wf01')

createApp({
    data() { return { count: 0, rootId: domConf.wf.l[0] } },
    mounted() { setDomComponent('workFlow', this) }, methods: {
        adn(adnId) { return mcData.eMap[adnId] || {} },
        parentChilds(adnId) { return mcData.parentChilds[adnId] || [] },
    }
}).mount('#workFlow')