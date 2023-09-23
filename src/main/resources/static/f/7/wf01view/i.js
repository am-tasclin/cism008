'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { initDomConfLogic, adn, adnIds, mcData, setDomComponent, getDomComponent, domConfWf, } from
    '/f/7/libDomGrid/libDomGrid.js'

initDomConfLogic(window.location.hash.substring(1))
console.log(domConfWf(), mcData)

//init WF01 model
const codeMetaData = [368597, 367562,], codeRepresentation = [377146,]
domConfWf().codes = codeMetaData.concat(codeRepresentation)
domConfWf().loggedAttributes = [372052, 377121, 377149, 377170, 377176]

import { ws } from '/f/7/libDbRw/wsDbRw.js'
// import { initWorkFlow } from '/f/7/libWF/libWF.js'
import { initWorkFlow } from '/f/7/wf02view/libWF.js'
import { initSelectMaker } from '/f/7/libDbRw/libSqlMaker.js'
import { readAdnByIds } from '/f/7/libDbRw/libMcRDb.js'

ws.onopen = event => initWorkFlow()

const sqlCarePlanIcPdMaker = initSelectMaker('sqlCarePlanIcPdMaker', 'doc')
    .initColumns('parent').initWhere('reference=2013 AND reference2 IN (:pdIds)')

domConfWf().reView.afterReadCodes = () => {
    getDomComponent('cmd').count++
    getDomComponent('ccr').count++
    console.log(domConfWf().taskComponent)
    Object.keys(domConfWf().taskComponent).forEach(i =>
        domConfWf().taskComponent[i].count++)
    console.log('END Read WF')
    readAdnByIds([sqlCarePlanIcPdMaker.get().replace(':pdIds', domConfWf().l.join(','))]).then(() => {
        domConfWf().cpIds = adnIds().filter(i => adn(i).r == 2015)
        console.log(mcData, domConfWf().cpIds)
        getDomComponent('wf01').count++
    })
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

import { cpSymbolR } from '/f/7/cp01view/libCP.js'
const { createApp } = Vue
const wf01 = createApp({
    data() { return { count: 0, rootId: domConfWf().l[0] } },
    mounted() { setDomComponent('wf01', this) }, methods: Object.assign({
        adn(adnId) { return mcData.eMap[adnId] || {} },
        cr() { return codeRepresentation },
        cmd() { return codeMetaData },
        cpIds: () => domConfWf().cpIds
    }, cpSymbolR), template: `
<h2 :review="count"> <span class="w3-tiny w3-opacity">{{rootId}}</span> {{adn(rootId).vl_str}} </h2>
<t-wf :adnid="rootId"></t-wf>
<div class="w3-border-top w3-opacity"> Система кодування </div>
<div class="w3-row w3-border-top">
    <div class="w3-half"><t-ccr :cr="cr()" /></div>
    <div class="w3-half">
        <div class="w3-row">
            <div class="w3-third"><t-cmd :cmd="cmd()" /></div>
            <div class="w3-twothird">
                <div class="w3-tiny w3-light-grey">CarePlan.instantiatesCanonical</div>
                <div v-for="cpId in cpIds()" class="w3-hover-shadow">
                    <span class="w3-tiny w3-opacity">{{cpId}}.{{cpSymbolR(cpId)}}</span>
                    {{adn(cpId).vl_str}}
                </div>
            </div>
        </div>
    </div>
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
