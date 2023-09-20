'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import {
    initDomConfLogic, domConfEMR, mcDataMethods
    , getDomComponent, setDomComponent
} from '/f/7/libDomGrid/libDomGrid.js'
initDomConfLogic(window.location.hash.substring(1))
console.log(domConfEMR())
import { readAdnByIds, deepN_readParent } from '/f/7/libDbRw/libMcRDb.js'
import { ws } from '/f/7/libDbRw/wsDbRw.js'
ws.onopen = event => domConfEMR().l.length && readAdnByIds(domConfEMR().l)
    .then(() => deepN_readParent(6, domConfEMR().l, [], afterReadEMR))

const afterReadEMR = (x, deepCount) => {
    console.log(x, deepCount, mcDataMethods.d)
    getDomComponent('emr01view').count++
}

import { emrSymbolR } from '/f/7/emr01view/libEMR.js'
const { createApp } = Vue
const emr01view = createApp({
    data() { return { count: 0, rootId: domConfEMR().l[0] } },
    mounted() { setDomComponent('emr01view', this) }, methods: Object.assign({

    }, mcDataMethods, emrSymbolR)
})
emr01view.mount('#emr01view')
