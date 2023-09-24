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

import { cpSymbolR } from '/f/7/cp01view/libCP.js'
import { setDomComponent, getDomComponent, } from '/f/7/libDomGrid/libDomGrid.js'
const { createApp } = Vue
createApp({
    data() { return { count: 0, rootId: domConfCP().l[0], } },
    mounted() { setDomComponent('cp01view', this) }, methods: Object.assign({
        basedOnCP: () => domConfCP().basedOnCP
    }, mcDataMethods, cpSymbolR)
}).mount('#cp01view')

domConfCP().reView.initAfterCarePlan = () => {
    getDomComponent('cp01view').count++
}
