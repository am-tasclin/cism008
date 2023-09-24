'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { mcDataMethods, adnIds, adn, initDomConfLogic, domConfCP, } from
    '/f/7/libDomGrid/libDomGrid.js'
initDomConfLogic(window.location.hash.substring(1))
console.log(domConfCP())

import { ws } from '/f/7/libDbRw/wsDbRw.js'
import { readOntologyTree } from '/f/7/libDbRw/libMcRDb.js'
import { initAfterCarePlan } from '/f/7/wf02view/libWF.js'
ws.onopen = event => readOntologyTree(domConfCP().l, initAfterCarePlan)

import { setDomComponent } from '/f/7/libDomGrid/libDomGrid.js'
import { cpSymbolR } from '/f/7/cp01view/libCP.js'
const { createApp } = Vue
createApp({
    data() { return { count: 0, rootId: domConfCP().l[0], } },
    mounted() { setDomComponent('cp02view', this) },methods: Object.assign({

    }, mcDataMethods, cpSymbolR),
    template: `
<span class="w3-tiny w3-opacity w3-right">cp02view {{count}}</span>
<span class="w3-tiny w3-opacity">{{rootId}}.{{cpSymbolR(rootId)}}</span>
{{adn(rootId).vl_str}}
a1
{{count}}
`,
}).mount('#cp02view')
createApp({
    data() { return { count: 0, rootId: domConfCP().l[0], } },
    mounted() { setDomComponent('cp01view', this) }, methods: Object.assign({
        basedOnCP: () => domConfCP().basedOnCP
    }, mcDataMethods, cpSymbolR)
}).mount('#cp01view')
import { getDomComponent, } from '/f/7/libDomGrid/libDomGrid.js'
domConfCP().reView.initAfterCarePlan = () => {
    getDomComponent('cp01view').count++
    getDomComponent('cp02view').count++
}
