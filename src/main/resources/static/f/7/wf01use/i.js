'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { initDomConfLogic, getDomComponent, } from
    '/f/7/libDomGrid/libDomGrid.js'
import { getDomConf } from '/f/7/libDomGrid/libDomGrid.js'

initDomConfLogic(window.location.hash.substring(1))
console.log(getDomConf('wf'),)

import { ws } from '/f/7/libDbRw/wsDbRw.js'
import { readOntologyTree } from '/f/7/libDbRw/libMcRDb.js'
import { initAfterPD } from '/f/7/wf02view/libWF.js'
ws.onopen = event => readOntologyTree(getDomConf('wf').l, initAfterPD)

const { createApp } = Vue
import { Wf02Use } from '/f/7/wf02view/libWF.js'
createApp(Wf02Use).mount('#wf02use')
getDomConf('wf').reView.initAfterPD = () => {
    // getDomComponent('wf01use').count++
    getDomComponent('wf02use').count++
}
getDomConf('wf').reView.readParent = () => {
    // getDomComponent('wf01use').count++
    getDomComponent('wf02use').count++
}

/*
const wf01use = createApp({
    data: () => { return { count: 0, rootId: getDomConf('wf').l[0] } },
    mounted() { setDomComponent('wf01use', this) }, methods: Object.assign({
        isSelectedActionId: adnId => getDomConf('wf').selectedActionId && getDomConf('wf')
            .selectedActionId.includes(adnId),
        actionData: adnId => getDomConf('wf').actionData && getDomConf('wf').actionData[adnId].list,
        onOffAction(adnId) {
            console.log(adnId, getDomConf('wf').selectedActionId)
            const selectedActionId = getDomConf('wf').selectedActionId || (getDomConf('wf').selectedActionId = [])
            !selectedActionId.includes(adnId) && selectedActionId.push(adnId)
                || selectedActionId.splice(selectedActionId.indexOf(), 1)

            // selectedActionId.includes(adnId) && pdActionByOpen(adnId, this)

            this.count++
        },
    }, mcDataMethods, wfSymbolR2, wfSymbolPR, childTaskId)
})
wf01use.component('t-wf-part', WfPart)
wf01use.mount('#wf01use')
*/