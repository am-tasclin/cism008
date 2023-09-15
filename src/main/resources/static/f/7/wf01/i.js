'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import {
    initDomConfLogic, mcData, setDomComponent,
} from '/f/7/libDomGrid/libDomGrid.js'
import { initWorkFlow } from '/f/7/wf01/libWF.js'

// console.log(window.location.hash.substring(1))
const domConf = initDomConfLogic(window.location.hash.substring(1))
console.log(domConf,)

import { ws } from '/f/7/libDbRw/wsDbRw.js'
ws.onopen = event => initWorkFlow()

const codeMetaData = [368597, 367562,]
    , codeRepresentation = [377146,]
domConf.wf.codes = codeMetaData.concat(codeRepresentation)
domConf.wf.loggedAttributes = [372052, 377121, 377149, 377170]

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
<div class="w3-border-top w3-opacity"> Система кодування </div>
<div class="w3-row w3-border-top">
    <div class="w3-half"><t-ccr :cr="cr()" /></div>
    <div class="w3-half"><t-cmd :cmd="cmd()" /></div>
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
