'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { initDomConfLogic, mcDataMethods, getDomComponent, setDomComponent, domConfWf, } from
    '/f/7/libDomGrid/libDomGrid.js'
initDomConfLogic(window.location.hash.substring(1))
console.log(domConfWf(),)

//init WF01 model
const codeMetaData = [368597, 367562,], codeRepresentation = [377146,]
domConfWf().codes = codeMetaData.concat(codeRepresentation)
domConfWf().loggedAttributes = [372052, 377121, 377149, 377170]

import { ws } from '/f/7/libDbRw/wsDbRw.js'
import { initWorkFlow, actionByOpen } from '/f/7/libWF/libWF.js'

ws.onopen = event => initWorkFlow()
domConfWf().reView.readParent = (list, prevList) => {
    getDomComponent('wf01use').count++
}

const { createApp } = Vue
createApp({
    data() { return { count: 0, rootId: domConfWf().l[0] } },
    mounted() { setDomComponent('wf01use', this) }, methods: Object.assign(mcDataMethods, {
        isSelectedActionId: adnId => domConfWf().selectedActionId && domConfWf().selectedActionId.includes(adnId),
        onOffAction(adnId) {
            const selectedActionId = domConfWf().selectedActionId || (domConfWf().selectedActionId = [])
            !selectedActionId.includes(adnId) && selectedActionId.push(adnId)
                || selectedActionId.splice(selectedActionId.indexOf(), 1)

            selectedActionId.includes(adnId) && actionByOpen(adnId)

            this.count++
        },
    })
}).mount('#wf01use')
