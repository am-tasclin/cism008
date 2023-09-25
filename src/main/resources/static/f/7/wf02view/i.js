'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { initDomConfLogic } from '/f/7/libDomGrid/libDomGrid.js'
initDomConfLogic(window.location.hash.substring(1))
console.log(getDomConf('wf'),)

import { ws } from '/f/7/libDbRw/wsDbRw.js'
import { readOntologyTree } from '/f/7/libDbRw/libMcRDb.js'
import { initAfterPD } from '/f/7/wf02view/libWF.js'
ws.onopen = event => readOntologyTree(getDomConf('wf').l, initAfterPD)

const { createApp } = Vue
import { mcDataMethods, getDomComponent, setDomComponent, setDomConfPart } from
    '/f/7/libDomGrid/libDomGrid.js'
import { codeRepresentation, CpBody, initAfterCarePlan } from '/f/7/wf02view/libWF.js'
import { cpSymbolR } from '/f/7/cp01view/libCP.js'
const wf02 = createApp({
    data() { return { count: 0, rootId: getDomConf('wf').l[0] } },
    mounted() { setDomComponent('wf02', this) }, methods: Object.assign({
        cr: () => codeRepresentation,
        cpIcPdList: () => getDomConf('wf').cpIcPdList,
        onOffCp: cpId => {
            !getDomConf('cp') && (() => {
                const cpList = getDomConf('wf').cpIcPdList.reduce((l, cp) =>
                    l.push(cp.doc_id) && l, [])
                setDomConfPart('cp', { l: cpList, })
                readOntologyTree(cpList, initAfterCarePlan)
            })();
            (getDomConf('wf').openedCP || (getDomConf('wf').openedCP = [])
            ).includes(cpId)
                && getDomConf('wf').openedCP.splice(getDomConf('wf').openedCP.indexOf(cpId), 1)
                || getDomConf('wf').openedCP.push(cpId)
            getDomComponent('wf02').count++
        }, isOpenedCP: adnId => getDomConf('wf').openedCP &&
            getDomConf('wf').openedCP.includes(adnId),
    }, mcDataMethods, cpSymbolR), components: { CpBody },
    template: `
<h2 :review="count"> <span class="w3-tiny w3-opacity">{{rootId}}</span> {{adn(rootId).vl_str}} </h2>
<t-wf :adnid="rootId"></t-wf>
<p><div class="w3-row w3-border-top">
    <div class="w3-half">
        <div style="text-align: center;"
            class="w3-light-grey am-b am-i">CarePlan.instantiatesCanonical</div>
        <template v-for="cp in cpIcPdList()">
            <div @click="onOffCp(cp.doc_id)"  class="w3-hover-shadow">
                <span class="w3-tiny w3-opacity">{{cp.doc_id}}.{{cpSymbolR(cp.doc_id)}}
                </span>&nbsp;
                <a :href="'/f/7/wf02view/cp.html#cp,'+cp.doc_id">{{cp.vl_str}}</a>
            </div>
            <template v-if="isOpenedCP(cp.doc_id)">
                <CpBody :rootId="cp.doc_id"/>
            </template>
        </template>
    </div>
    <div class="w3-half"><t-ccr :cr="cr()" /></div>
</div></p>`,
})
import { WfElement, CodeableConceptRepresentation, } from '/f/7/libWF/WfElement.js'
wf02.component('t-wf', WfElement)
wf02.component('t-ccr', CodeableConceptRepresentation)
wf02.mount('#wf02')
import { getDomConf } from '/f/7/libDomGrid/libDomGrid.js'
getDomConf('wf').reView.initAfterPD = () => {
    getDomComponent('wf02').count++
}
getDomConf('wf').reView.initAfterCarePlan = () => {
    getDomComponent('cpBody').count++
}
