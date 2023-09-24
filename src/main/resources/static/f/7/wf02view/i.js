'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { initDomConfLogic, mcDataMethods, getDomComponent, setDomComponent, domConfWf, } from
    '/f/7/libDomGrid/libDomGrid.js'
initDomConfLogic(window.location.hash.substring(1))
console.log(domConfWf(),)

import { initWorkFlowFn } from '/f/7/wf02view/libWF.js'
import { ws } from '/f/7/libDbRw/wsDbRw.js'
import { readOntologyMC } from '/f/7/libDbRw/libMcRDb.js'
initWorkFlowFn()
ws.onopen = event => readOntologyMC('wf', domConfWf().l)

const { createApp } = Vue
import { codeRepresentation } from '/f/7/wf02view/libWF.js'
import { cpSymbolR } from '/f/7/cp01view/libCP.js'
const wf02 = createApp({
    data() { return { count: 0, rootId: domConfWf().l[0] } },
    mounted() { setDomComponent('wf02', this) }, methods: Object.assign({
        cr: () => codeRepresentation,
        cpIcPdList: () => domConfWf().cpIcPdList,
        onOffCp: adnId => {
            console.log(adnId)
        },
    }, mcDataMethods, cpSymbolR),
    template: `
<h2 :review="count"> <span class="w3-tiny w3-opacity">{{rootId}}</span> {{adn(rootId).vl_str}} </h2>
<t-wf :adnid="rootId"></t-wf>
<p>
<div class="w3-row w3-border-top">
    <div class="w3-half">
        <div class="w3-tiny w3-light-grey">CarePlan.instantiatesCanonical</div>
        <div @click="onOffCp(cp.doc_id)" v-for="cp in cpIcPdList()" class="w3-hover-shadow">
            <span class="w3-tiny w3-opacity">{{cp.doc_id}}.{{cpSymbolR(cp.doc_id)}}
            </span>&nbsp;
            <a :href="'/f/7/wf02view/cp.html#cp,'+cp.doc_id">{{cp.vl_str}}</a>
        </div>
    </div>
    <div class="w3-half"><t-ccr :cr="cr()" /></div>
</div>
</p>
`,
})
import { WfElement, CodeableConceptRepresentation, CodeMetaData } from '/f/7/libWF/WfElement.js'
wf02.component('t-wf', WfElement)
wf02.component('t-ccr', CodeableConceptRepresentation)
wf02.mount('#wf02')
domConfWf().reView.initAfterPD = () => {
    getDomComponent('wf02').count++
}
