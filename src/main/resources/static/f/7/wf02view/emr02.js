'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
moment.locale('uk')
import { initDomConfLogic, getDomConf } from '/f/7/libDomGrid/libDomGrid.js'
initDomConfLogic(window.location.hash.substring(1))
console.log(getDomConf('emr'))

import { ws } from '/f/7/libDbRw/wsDbRw.js'
import { readOntologyTree } from '/f/7/libDbRw/libMcRDb.js'
import { afterReadEMR } from '/f/7/wf02view/libWF.js'
ws.onopen = event => readOntologyTree(getDomConf('emr').l, afterReadEMR)

import { mcDataMethods, adn, parentChilds, setDomComponent, getDomComponent } from '/f/7/libDomGrid/libDomGrid.js'
import { emrSymbolR } from '/f/7/emr01view/libEMR.js'
import { isEmrData } from '/f/7/wf02view/libWF.js'
const { createApp } = Vue
const emr02 = createApp({
    data() { return { count: 0, rootId: getDomConf('emr').l[0] } },
    mounted() { setDomComponent('emr02', this) }, methods: Object.assign({
        startPeriodChild: adnId => parentChilds(adnId)
            .find(i => '🕘' == emrSymbolR.emrSymbolR(i)),
        momentF: (adnId, f) => moment(adn(adnId).ts).format(f),
        isPatientData: adnId => isEmrData(adnId),
        clickErBonCpPd(cpElId) {
            console.log(cpElId, adn(cpElId).r2)
        },
    }, mcDataMethods, emrSymbolR)
})
emr02.mount('#emr02')
getDomConf('emr').reView.afterReadEMR = () => {
    getDomComponent('emr02').count++
}
