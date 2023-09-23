'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { initDomConfLogic, mcDataMethods, getDomComponent, setDomComponent, domConfWf, } from
    '/f/7/libDomGrid/libDomGrid.js'
initDomConfLogic(window.location.hash.substring(1))
console.log(domConfWf(),)
console.log(domConfWf().reView)

import { ws } from '/f/7/libDbRw/wsDbRw.js'
import { initWorkFlow, codeRepresentation } from '/f/7/wf02view/libWF.js'
ws.onopen = event => initWorkFlow(domConfWf().l)

domConfWf().reView.initAfterPD = () => {
    getDomComponent('wf02').count++
}

const { createApp } = Vue
const wf02 = createApp({
    data() { return { count: 0, rootId: domConfWf().l[0] } },
    mounted() { setDomComponent('wf02', this) }, methods: Object.assign({
        cr:() => codeRepresentation ,
    }, mcDataMethods),
    template: `
<h2 :review="count"> <span class="w3-tiny w3-opacity">{{rootId}}</span> {{adn(rootId).vl_str}} </h2>
<t-wf :adnid="rootId"></t-wf>
{{cr()}}
{{count}}
<p>
<div class="w3-row w3-border-top">
    <div class="w3-half">
    a2
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