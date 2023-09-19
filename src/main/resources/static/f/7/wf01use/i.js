'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { initDomConfLogic, mcDataMethods, getDomComponent, setDomComponent, domConfWf, } from
    '/f/7/libDomGrid/libDomGrid.js'
const adn = mcDataMethods.adn, parentChilds = mcDataMethods.parentChilds
initDomConfLogic(window.location.hash.substring(1))
console.log(domConfWf(),)

//init WF01 model
const codeMetaData = [368597, 367562,], codeRepresentation = [377146,]
domConfWf().codes = codeMetaData.concat(codeRepresentation)
domConfWf().loggedAttributes = [372052, 377121, 377149, 377170, 377176]

import { ws } from '/f/7/libDbRw/wsDbRw.js'
import {
    initWorkFlow, initTaskIc, wfSymbolPR, wfSymbolR2, childTaskId,
    TaskTagIds, taskIOCmd, wfType, findTasksInPDAction
} from '/f/7/libWF/libWF.js'

ws.onopen = event => initWorkFlow()
domConfWf().reView.readParent = (list, prevList) => {
    getDomComponent('wf01use').count++
}

const TitSelect = {
    props: { taskIcId: Number }, data() { return { count: 0 } },
    computed: {
        pdActionIds() {
            return parentChilds(parentChilds(adn(this.activityDefinitionId()).p)
                .find(i => '[]' == wfType[adn(i).r]))
        },
    }, mounted() {
        initTaskIc(this.taskIcId, this)
        console.log(this.pdActionIds)
        this.pdActionIds.forEach(i => findTasksInPDAction(i, this, (taskIcId, proxy) => {
            const taskId = adn(taskIcId).r2
            console.log(i, taskIcId, taskId)
            // this.count++
        }))
    }, methods: Object.assign({}, {
        activityDefinitionId() { return adn(this.taskIcId).p },
        actionData() {
            return domConfWf().actionData && domConfWf()
                .actionData[this.activityDefinitionId()].list
        },
        setSelectedId(adnId) {
            console.log(adnId, domConfWf(), wfType)

        },
    }, mcDataMethods), template: `
<div class="w3-border-top w3-container">
    <span class="w3-tiny w3-right">{{taskIcId}}:TitSelect:{{count}}</span>
    <div class="w3-border-bottom">
        <div v-for="pdActionId in pdActionIds">
            <span class="w3-tiny">{{pdActionId}}</span>
            {{adn(pdActionId).vl_str}}
        </div>
    </div>
    <div @click="setSelectedId(im.doc_id) " v-for="im in actionData()" class="w3-hover-shadow">
        <span class="w3-tiny">{{im.doc_id}}</span>
        {{im.vl_str}}
    </div>
</div>`,
}

const WfPart = {
    components: { TitSelect },
    template: `<component :is="taskTagName()" :taskIcId="taskIcId()"></component>`,
    props: { adnid: Number }, data() { return { count: 0 } }, methods: {
        taskIcId() { return childTaskId.childTaskId(this.adnid) },
        taskId() { return adn(this.taskIcId()).r2 },
        taskTagName() {
            const taskTagId = taskIOCmd(parentChilds(this.taskId())
                .find(i => TaskTagIds.includes(taskIOCmd(i))))
            return this.taskId() && adn(taskTagId).vl_str.replace('.', '')
        }
    },
}

const { createApp } = Vue
const wf01use = createApp({
    data() { return { count: 0, rootId: domConfWf().l[0] } },
    mounted() { setDomComponent('wf01use', this) }, methods: Object.assign({}, {
        isSelectedActionId: adnId => domConfWf().selectedActionId && domConfWf()
            .selectedActionId.includes(adnId),
        actionData: adnId => domConfWf().actionData && domConfWf().actionData[adnId].list,
        onOffAction(adnId) {
            console.log(adnId, domConfWf().selectedActionId)
            const selectedActionId = domConfWf().selectedActionId || (domConfWf().selectedActionId = [])
            !selectedActionId.includes(adnId) && selectedActionId.push(adnId)
                || selectedActionId.splice(selectedActionId.indexOf(), 1)

            // selectedActionId.includes(adnId) && pdActionByOpen(adnId, this)

            this.count++
        },
    }, mcDataMethods, wfSymbolR2, wfSymbolPR, childTaskId)
})
wf01use.component('t-wf-part', WfPart)
wf01use.mount('#wf01use')
