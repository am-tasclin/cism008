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

import { mcDataMethods, adn, parentChilds, initDomConfPart, setDomComponent, getDomComponent } from
    '/f/7/libDomGrid/libDomGrid.js'
import { emrSymbolR } from '/f/7/emr01view/libEMR.js'
import { initAfterPD, isEmrData } from '/f/7/wf02view/libWF.js'

const Emr02View = {
    data() { return { count: 0, rootId: getDomConf('emr').l[0] } },
    mounted() { setDomComponent('emr02', this) }, methods: Object.assign({
        startPeriodChild: adnId => parentChilds(adnId)
            .find(i => '🕘' == emrSymbolR.emrSymbolR(i)),
        momentF: (adnId, f) => moment(adn(adnId).ts).format(f),
        isPatientData: adnId => isEmrData(adnId),
        clickEmr_basedOnCpPd(encounterId, cpElId) {
            console.log(encounterId, cpElId, adn(cpElId).r2)
            getDomConf('emr').encounterId = encounterId
            const activePdId = getDomConf('emr').activePdId = adn(cpElId).r2
            initDomConfPart('wf').l = [activePdId]
            readOntologyTree([activePdId], initAfterPD)
        },
    }, mcDataMethods, emrSymbolR)
}

const { createApp } = Vue
createApp(Emr02View).mount('#emr02')
getDomConf('emr').reView.afterReadEMR = () => getDomComponent('emr02').count++

import { Wf02Use } from '/f/7/wf02view/libWF.js'
createApp({
    mounted() { setDomComponent('wf03', this) }, components: { Wf02Use }, template: `
<div class="w3-light-grey am-b" style="text-align: center;">⛋&nbsp;WF03</div>
<Wf02Use />`,
}).mount('#wf03')
/**
 * 
 */
initDomConfPart('wf')
getDomConf('wf').reView.initAfterPD = () =>
    getDomComponent('wf02use').rootId = getDomConf('wf').l[0]

getDomConf('wf').taskWfExe.clickAdBtn = props => {
    console.log(getDomConf('emr').encounterId, props, adn(props.adId),)
    const actionDataId = adn(props.taskIcId).p
        , actionData = getDomConf('wf').actionData[actionDataId]
        , selectedIdForAd = actionData.selectedId
        , taskId = adn(parentChilds(props.adId).find(i => 2001 == adn(i).r)).r2
    console.log(taskId, parentChilds(taskId), selectedIdForAd)
    const mcJson = {}
    parentChilds(taskId).forEach(i => {
        console.log(i, adn(i), adn(i).vl_str)
        const mcPattern = JSON.parse(adn(i).vl_str)
        // console.log(mcPattern, mcPattern.pName)
        mcPattern.pName && (mcJson.p = getDomConf('emr')[mcPattern.pName])
        mcPattern.cmd && (mcJson.cmd = mcPattern.cmd)
        console.log(mcJson)
    })
}
