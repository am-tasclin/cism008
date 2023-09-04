'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import {
    confTree, initDomConfLogic, domConfStrignify
    , uniqueIdPageRead, uniqueTreeOpenedId, pathActuallyTreeObj
    , actuallyTreeObj, setActuallyTreeObj, reViewAdn, addTreeFn
    , setDomComponent, mcData
    , setActualeCompomentName, getActualeCompomentName
} from '/f/7/libDomGrid/libDomGrid.js'
import { ws } from '/f/7/libDbRw/wsDbRw.js'
import { readAdnByIds, readAdnByParentIds } from '/f/7/libDbRw/libMcRDb.js'

initDomConfLogic(window.location.hash.substring(1))
const uniqueIdsForDbRead = uniqueIdPageRead()

import { getDomComponent, domConfHrefHash, } from '/f/7/libDomGrid/libDomGrid.js'
ws.onopen = event =>
    uniqueIdsForDbRead.length && readAdnByIds(uniqueIdsForDbRead
    ).then(() => {
        const uniqueTreeOpenedId_l = uniqueTreeOpenedId()
        uniqueTreeOpenedId_l.length && readAdnByParentIds(uniqueTreeOpenedId_l
        ).then(() => uniqueTreeOpenedId_l.forEach(parentId => reViewAdn(parentId))
        ).then(() => {
            console.log(uniqueTreeOpenedId_l)
            !actuallyTreeObj().tree && setActuallyTreeObj(pathActuallyTreeObj())
        })
    })

const { createApp } = Vue
import McElement from '/f/7/libDomGrid/McElement.js'
const app_treeDom = createApp({
    data() { return { count: 0, } },
    mounted() {
        setDomComponent('treeDom', this)
    }, methods: {
        confTreeRootList() { return confTree()[0] && confTree()[0].rootList || [] },
    }, template: `
<div v-for="adnId in confTreeRootList()">
    <t-mc-element :adnId="adnId" :treeRootId="adnId" path="tree,0" />
</div><span class="w3-hide">{{count}}</span>
`,
})
app_treeDom.component('t-mc-element', McElement)
app_treeDom.mount('#treeDom')

import AdnEditPanel from '/f/7/libDomGrid/AdnEditPanel.js'
createApp({
    data() { return { count: 0, addTreeId: 0, } },
    mounted() {
        setDomComponent('actuallyEdit', this)
    }, methods: {
        treeSelectedId() { return actuallyTreeObj() && actuallyTreeObj().selectedId },
        actuallyCompomentName() { return getActualeCompomentName() },
        addTreeFn() {
            addTreeFn(this.addTreeId)
            !mcData.eMap[this.addTreeId] && readAdnByIds([this.addTreeId]
            ).then(() => getDomComponent('treeDom').count++
            ).then(() => domConfHrefHash())
        },
    }
}).component('t-adn-edit-panel', AdnEditPanel).mount('#actuallyEdit')

createApp({
    mounted() {
        setDomComponent('devTest', this)
    }, methods: {
        showConf() {
            domConfStrignify()
        }, click() {
            setActualeCompomentName('devTest')
            getDomComponent('actuallyEdit').count++
            getDomComponent('adnEditPanel').count++
        }
    }
}).mount('#devTest')
