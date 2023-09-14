'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import {
    initDomConfLogic, mcData, setDomComponent, getDomComponent,
    domConstants
} from '/f/7/libDomGrid/libDomGrid.js'
import { readAdnByIds, readAdnByParentIds, initNamedSql } from '/f/7/libDbRw/libMcRDb.js'

// console.log(window.location.hash.substring(1))
const domConf = initDomConfLogic(window.location.hash.substring(1))
const uniqueIdsForDbRead = domConf.wf.l
console.log(domConf, uniqueIdsForDbRead)

import { ws } from '/f/7/libDbRw/wsDbRw.js'
ws.onopen = event =>
    uniqueIdsForDbRead.length && readAdnByIds(uniqueIdsForDbRead
    ).then(() => deepN_readParent(deepNum, uniqueIdsForDbRead, [], readTasks))

const readTasks = (x, deepCount) => {
    // console.log('afterDeepN --> ', x, deepCount, mcData, domConstants)
    const taskList = Object.keys(mcData.eMap).reduce((l, i) => domConstants.taskElementList
        .includes(mcData.eMap[i].r) && l.push(mcData.eMap[i].r2) && l || l, [])
    // console.log(deepCount, taskList)
    taskList.length && readAdnByIds(taskList
    ).then(() => deepN_readParent(deepNum, taskList, [], afterReadTasks))
}
const codeMetaData = [368597, 367562,]
const codeRepresentation = [377146,]
const codes = codeMetaData.concat(codeRepresentation)
const afterReadTasks = (x, deepCount) => {
    // console.log(mcData.eMap[377155], mcData.parentChilds[377155])
    // console.log(mcData.eMap[377156], mcData.parentChilds[377156])
    // console.log(34, codes, initNamedSql({ n: 'selectDocVlStrByParentIds', l: [377108] }))
    readAdnByIds(codes).then(() =>
        deepN_readParent(deepNum, codes, [], afterReadCodes))
}
const loggedAttributes = [372052]
const afterReadCodes = (x, deepCount) => {
    console.log(deepCount, mcData)
    readAdnByIds(loggedAttributes).then(() => {
        getDomComponent('cmd').count++
        getDomComponent('ccr').count++
    })
}

const deepNum = 6
const deepN_readParent = (deepCount, list, prevList, fn) => {
    // console.log(deepCount, list, list.length)
    // console.log(deepCount, deepCount == 0, !list.length, deepCount == 0 || !list.length);
    (deepCount == 0 || !list.length) && fn(list, deepCount)
    deepCount > 0 && list.length && readAdnByParentIds(list).then(() => {
        getDomComponent('workFlow').count++
        getDomComponent('wf01').count++
        codes[0] == prevList[0] && getDomComponent('ccr').count++
        codes[0] == prevList[0] && getDomComponent('cmd').count++
        list.forEach(i => domConf.wf.taskComponent[i] &&
            domConf.wf.taskComponent[i].count++)
        prevList.find(i => domConf.wf.taskComponent[i] && mcData.parentChilds[i] &&
            domConf.wf.taskComponent[i].count++)

        list.forEach(i => domConf.wf.wfComponent[i] && domConf.wf.wfComponent[i].count++)
        list.forEach(i => mcData.eMap[i] && domConf.wf.wfComponent[mcData.eMap[i].p] &&
            domConf.wf.wfComponent[mcData.eMap[i].p].count++)
        const newList = Object.keys(mcData.eMap).filter(i => !mcData.parentChilds[i] && !prevList.includes(i))
        // console.log(deepCount, newList, newList.length)
        deepN_readParent(--deepCount, newList, list.concat(newList), fn)
    })
}

const { createApp } = Vue
const wf01 = createApp({
    data() { return { count: 0, rootId: domConf.wf.l[0] } },
    mounted() { setDomComponent('wf01', this) }, methods: {
        adn(adnId) { return mcData.eMap[adnId] || {} },
        cr() { return codeRepresentation },
        cmd() { return codeMetaData },
    }, template: `
<h2 :review="count"> {{adn(rootId).vl_str}} </h2>
<t-wf :adnid="rootId"></t-wf>
<div class="w3-border-top w3-opacity">
    Система кодування
</div>

<div class="w3-row w3-border-top">
    <div class="w3-half">
        <t-ccr :cr="cr()" />
    </div>
    <div class="w3-half">
        <t-cmd :cmd="cmd()" />
    </div>
</div>
`,
})
import WfElement from '/f/7/libWF/WfElement.js'
wf01.component('t-wf', WfElement)
import { CodeableConceptRepresentation, CodeMetaData } from '/f/7/libWF/WfElement.js'
wf01.component('t-ccr', CodeableConceptRepresentation)
wf01.component('t-cmd', CodeMetaData)
wf01.mount('#wf01')

createApp({
    data() { return { count: 0, rootId: domConf.wf.l[0] } },
    mounted() { setDomComponent('workFlow', this) }, methods: {
        adn(adnId) { return mcData.eMap[adnId] || {} },
        parentChilds(adnId) { return mcData.parentChilds[adnId] || [] },
    }
}).mount('#workFlow')