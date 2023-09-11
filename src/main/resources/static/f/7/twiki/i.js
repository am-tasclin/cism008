'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { initDomConfLogic, setDomComponent, reViewAdn } from
    '/f/7/libDomGrid/libDomGrid.js'
const domConf = initDomConfLogic(window.location.hash.substring(1))
// const uniqueIdsForDbRead1 = uniqueIdPageRead()
// console.log(uniqueIdsForDbRead1)

console.log(domConf)
const uniqueIdsForDbRead = domConf.actuallyTreeObj
    && domConf.hew.l.concat(domConf.actuallyTreeObj.rootList)
    || domConf.hew.l

console.log(uniqueIdsForDbRead)

import { ws } from '/f/7/libDbRw/wsDbRw.js'
import { readAdnByIds, readAdnByParentIds } from '/f/7/libDbRw/libMcRDb.js'
import { domConfHew } from '/f/7/libDomGrid/libDomGrid.js'

ws.onopen = event =>
    uniqueIdsForDbRead.length && readAdnByIds(uniqueIdsForDbRead
    ).then(() => readAdnByParentIds(uniqueIdsForDbRead
    ).then(() => {
        // console.log(domConf.actuallyTreeObj.rootList, 123, domConf, domConfHew())
        domConf.actuallyTreeObj &&
            domConf.actuallyTreeObj.rootList.forEach(treeId => reViewAdn(treeId))
    }).then(() => uniqueIdsForDbRead.forEach(hewId => domConfHew().hewComponent[hewId].count++)))

import { reViewActivePanel } from '/f/7/libDomGrid/libDomGrid.js'
import Hew from '/f/7/libHew/Hew.js'
import McElement from '/f/7/libDomGrid/McElement.js'
const { createApp } = Vue
const pageConf = createApp({
    data() { return { count: 0, } },
    mounted() { setDomComponent('rootHew', this) }, methods: {
        clickTree(treeId) { reViewActivePanel(treeId, 'Tree') },
        clickHew(hewId) { reViewActivePanel(hewId, 'Hew') },
        domConf() { return domConf },
        domConfStringify() { return JSON.stringify(domConf, '', 2) },
    }, template: `
<template v-for="hewId in domConf().hew.l">
    <t-hew :hewid="1*hewId" :hewdocid="1*hewId"></t-hew>
    <hr />
</template> <span class="w3-hide">{{count}}</span>`,
})
pageConf.component('t-hew', Hew).mount('#hew')
pageConf.mount('#pageConf')

const app_treeDom = createApp({
    methods: {
        domConf() { return domConf },
    }, template: `
<div v-for="(tg,tgi) in domConf().tree">
    <template v-for="adnId in tg.rootList">
        <t-mc-element :adnId="adnId" :treeRootId="adnId" :path="'tree,'+tgi" />
    </template>
</div>
`,
})
app_treeDom.component('t-mc-element', McElement)
app_treeDom.mount('#treeDom')

import HewEp from '/f/7/libDomGrid/editPanel/HewEp.js'
import TreeEp from '/f/7/libDomGrid/editPanel/TreeEp.js'
createApp({
    data() { return { count: 0, } }, components: { HewEp, TreeEp },
    mounted() { setDomComponent('actuallyEdit', this) }, methods: {
        domConf() { return domConf },
        tagName() {
            console.log(domConf.activeEditObjName)
            return domConf.activeEditObjName + 'Ep'
        }
    }, template: `
<component :is="tagName()"></component>
<div> Hi Edit
    :{{tagName()}}:{{count}}
    {{domConf().activeEditObjName}}:{{domConf().activeEditId}}
</div>
`,
}).mount('#actuallyEdit')
