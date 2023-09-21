'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { initDomConfLogic, mcData, setDomComponent, getDomComponent, domConfWf, } from
    '/f/7/libDomGrid/libDomGrid.js'

initDomConfLogic(window.location.hash.substring(1))
console.log(domConfWf(), mcData)

//init WF01 model
const codeMetaData = [368597, 367562,], codeRepresentation = [377146,]
domConfWf().codes = codeMetaData.concat(codeRepresentation)
domConfWf().loggedAttributes = [372052, 377121, 377149, 377170, 377176]

domConfWf().reView.afterReadCodes = () => {
    getDomComponent('cmd').count++
    getDomComponent('ccr').count++
    console.log(domConfWf().taskComponent)
    Object.keys(domConfWf().taskComponent).forEach(i =>
        domConfWf().taskComponent[i].count++)
}
domConfWf().reView.readParent = (list, prevList) => {
    getDomComponent('workFlow').count++
    getDomComponent('wf01').count++
    domConfWf().codes[0] == prevList[0] && getDomComponent('ccr').count++
    domConfWf().codes[0] == prevList[0] && getDomComponent('cmd').count++
    list.forEach(i => domConfWf().taskComponent[i] &&
        domConfWf().taskComponent[i].count++)
    prevList.find(i => domConfWf().taskComponent[i] && mcData.parentChilds[i] &&
        domConfWf().taskComponent[i].count++)

    list.forEach(i => domConfWf().wfComponent[i] && domConfWf().wfComponent[i].count++)
    list.forEach(i => mcData.eMap[i] && domConfWf().wfComponent[mcData.eMap[i].p] &&
        domConfWf().wfComponent[mcData.eMap[i].p].count++)
}

import { ws } from '/f/7/libDbRw/wsDbRw.js'
import { initWorkFlow } from '/f/7/libWF/libWF.js'
ws.onopen = event => initWorkFlow()

const { createApp } = Vue
const wf01 = createApp({
    data() { return { count: 0, rootId: domConfWf().l[0] } },
    mounted() { setDomComponent('wf01', this) }, methods: {
        adn(adnId) { return mcData.eMap[adnId] || {} },
        cr() { return codeRepresentation },
        cmd() { return codeMetaData },
    }, template: `
<h2 :review="count"> <span class="w3-tiny w3-opacity">{{rootId}}</span> {{adn(rootId).vl_str}} </h2>
<t-wf :adnid="rootId"></t-wf>
<div class="w3-border-top w3-opacity"> Система кодування </div>
<div class="w3-row w3-border-top">
    <div class="w3-half"><t-ccr :cr="cr()" /></div>
    <div class="w3-half"><t-cmd :cmd="cmd()" /></div>
</div>`,
})
import { WfElement, CodeableConceptRepresentation, CodeMetaData } from '/f/7/libWF/WfElement.js'
wf01.component('t-wf', WfElement)
wf01.component('t-ccr', CodeableConceptRepresentation)
wf01.component('t-cmd', CodeMetaData)
wf01.mount('#wf01')

createApp({
    data() { return { count: 0, rootId: domConfWf().l[0] } },
    mounted() { setDomComponent('workFlow', this) }, methods: {
        adn(adnId) { return mcData.eMap[adnId] || {} },
        parentChilds(adnId) { return mcData.parentChilds[adnId] || [] },
    }
}).mount('#workFlow')
