'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import {
    getDomConf, adnIds, adn, mcData, parentChilds, domConstants, getDomComponent
} from '/f/7/libDomGrid/libDomGrid.js'
import { executeSelectQuery } from '/f/7/libDbRw/wsDbRw.js'
import { readOntologyTree, initNamedSql } from '/f/7/libDbRw/libMcRDb.js'
/**
 * Build EMR -- Electronic Medical Record - meta-content
 */
export const afterReadEMR = () => {
    // getDomComponent('emr01view').count++
    reViewInit(['emr'], 'afterReadEMR')
    /**
     * Read R2 -- data list
     */
    const emrR2DataList = adnIds().reduce((l, i) => isEmrData(i)
        && l.push(mcDataMethods.adn(i).r2) && l || l, [])
    readOntologyTree(emrR2DataList, afterReadEmrR2Data)
}, isEmrData = adnId =>
    domConstants.EpisodeOfCareIds.includes(mcDataMethods.adn(adnId).r)
    || domConstants.EncounterIds.includes(mcDataMethods.adn(adnId).r)
    || domConstants.DocumentReferenceIds.includes(mcDataMethods.adn(adnId).r)
const sql_ts = 'SELECT timestamp_id id, value::timestamp as ts FROM timestamp WHERE timestamp_id IN (:ids)'

const afterReadEmrR2Data = (x, deepCount) => {
    console.log(x, deepCount, mcDataMethods.mcData())
    // getDomComponent('emr01view').count++
    reViewInit(['emr'], 'afterReadEMR')
    // console.log(adnIds(), sql_ts)
    /**
     * Read timestamp data
     */
    executeSelectQuery(sql_ts.replace(':ids', adnIds().join(','))
    ).then(json => {
        json.list.forEach(tso => adn(tso.id).ts = tso.ts)
        // getDomComponent('emr01view').count++
        reViewInit(['emr'], 'afterReadEMR')
    }).then(() => {
        console.log(1123)
    })
}
/**
* Build CarePlan Meta-Content code
* @param {Array} l 
* @returns 
*/
//export const initCarePlan = l => readOntologyTree(l, initAfterCarePlan)
export const initAfterCarePlan = () => {
    reViewInit(['cp', 'wf'], 'initAfterCarePlan')
    /**
     * Read R2 -- data list of this CarePlans
     */
    const r2List = adnIds().reduce((l, i) => adn(i).r2 && l.push(adn(i).r2) && l || l, [])
    console.log(r2List)
    readOntologyTree(r2List, initAfterCpR2)
}
const initAfterCpR2 = () => {
    /**
     * Read basdOn this CarePlans
     */
    const sql = selectOnBasedOnMaker.get().replace(':idList', getDomConf('cp').l.join(','))
    executeSelectQuery(sql).then(json => {
        const parentIds = json.list.reduce((l, o) => l.push(o.doc_id) && l, [])
        getDomConf('cp').basedOnCP = parentIds
        console.log(parentIds, json)
        readOntologyTree(parentIds, afterBasedOn)
    })
}, afterBasedOn = (x, deepCount) => {
    reViewInit(['cp', 'wf'], 'initAfterCarePlan')
    // getDomConf('cp').reView.initAfterCarePlan && getDomConf('cp').reView.initAfterCarePlan()
    console.log(x, deepCount)
}

const reViewInit = (nl, nF) => nl.forEach(n =>
    getDomConf(n) && getDomConf(n).reView && getDomConf(n).reView[nF] && getDomConf(n).reView[nF]())

import { initSelectMaker } from '/f/7/libDbRw/libSqlMaker.js'
const selectOnBasedOnMaker = initSelectMaker('selectOnBasedOn', 'doc')
    .initColumns('doc_id').initLeftJoin(
        '(SELECT doc_id basedon_id FROM doc WHERE reference=2014) x', 'reference=basedon_id')
    .initWhere('reference2 IN (:idList)').andWhere('reference!=2008') // !Encounter.basedOn (NOT)

export const codeRepresentation = [377146,] //'ccr'
    , codeMetaData = [368597, 367562,] // 'cmd'
const loggedAttributes = [372052, 377121, 377149, 377170, 377176]
    , codeMetaDataIds = codeRepresentation.concat(codeMetaData).concat(loggedAttributes)
    , componentCMD = ['ccr', 'cmd']

/**
 * Read WorkFlow.PlanDefinition meta-content code data
 */
export const initAfterPD = () => {
    // console.log(deepCount)
    Object.keys(getDomConf('wf').wfComponent).forEach(i =>
        getDomConf('wf').wfComponent[i].count++)
    // getDomConf('wf').reView.initAfterPD && getDomConf('wf').reView.initAfterPD()
    reViewInit(['emr', 'wf'], 'initAfterPD')
    /**
     * Read Meta-data for this WorkFlow code
     */
    readOntologyTree(codeMetaDataIds, initCodeMetaData)
}
const initCodeMetaData = (x, deepCount) => {
    console.log(deepCount)
    componentCMD.forEach(n => getDomComponent(n) &&
        getDomComponent(n).count++)
    // getDomComponent('ccr') && getDomComponent('ccr').count++
    /**
     * Read Task for this WorkFlows
     */
    const taskList = adnIds().reduce((l, i) => domConstants.TaskIdList
        .includes(adn(i).r) && l.push(adn(i).r2) && l || l, [])
    readOntologyTree(taskList, initAfterTask)
}, initAfterTask = (x, deepCount) => {
    // console.log(x, getDomConf('wf').codes, getDomConf('wf').taskComponent)
    Object.keys(getDomConf('wf').taskComponent).forEach(i =>
        getDomConf('wf').taskComponent[i].count++)
    /**
     * Read CarePlans for this WorkFolws
     */
    executeSelectQuery(selectCarePlanIcPdMaker.get().replace(':planDefinitionIds'
        , getDomConf('wf').l.join(','))).then(json => cpIcPdList(json))
}, cpIcPdList = cpIcPdList => {
    (getDomConf('wf').cpIcPdList = cpIcPdList.list).forEach(cp => mcData.eMap[cp.cp_id] = cp)
    // getDomConf('wf').reView.initAfterPD && getDomConf('wf').reView.initAfterPD()
    reViewInit(['emr', 'wf'], 'initAfterPD')

}
/**
 * CarePlan.instantiatesCanonical to PlanDefinition request
 */
const selectCarePlanIcPdMaker = initSelectMaker('selectCarePlanIcPdMaker', 'doc')
    .initWhere('reference2 IN (:planDefinitionIds)')
    .andWhere('reference=2013')
    .initLeftJoin('string', 'parent=string_id')
    .initColumns('parent doc_id, parent cp_id, 2015 r, reference2 pd_id, value vl_str')
/**
 * Task part of WorkFlow code
 */
/**
 * 
 * @param {Number} adnId 
 * @returns 
 */
export const taskIOCmd = adnId => adn(adn(adn(adnId).r2).r2).p
/**
 * Find ActivityDefinition in PlanDefinition.action
 * @param {Number} pdActionId 
 * @returns 
 */
export const findAdInPDAction = pdActionId => parentChilds(pdActionId)
    .find(i => domConstants.ActivityDefinitionIdList.includes(adn(i).r2))
/**
 * 
 * @param {Number} pdActionId -- PlanDefinition.action id
 * @param {*} proxy 
 * @param {Function} tasksInADFn 
 */
export const findTasksInPDAction = (pdActionId, proxy, tasksInADFn) => {
    const activityDefinitionId = findAdInPDAction(pdActionId)
    activityDefinitionId && tasksInADFn(childTaskId.childTaskId(activityDefinitionId), proxy)
}
/**
 * 
 * @param {*} taskIcId 
 */
export const initTaskIc = (taskIcId, proxy) => {
    const tasksInAD = parentChilds(adn(taskIcId).r2)
    const taskAutoExecuteId = tasksInAD.find(i => domConstants.TaskIOAutoExecute.includes(taskIOCmd(i)))
    taskAutoExecuteId && (() => {
        const sqlJson = JSON.parse(adn(taskAutoExecuteId).vl_str), sql = initNamedSql(sqlJson)
        executeSelectQuery(sql).then(json => {
            const actionData = getDomConf('wf').actionData || (getDomConf('wf').actionData = {})
                , activityDefinitionId = adn(taskIcId).p
            actionData[activityDefinitionId] = json
            console.log(activityDefinitionId, taskIcId, getDomConf('wf'))
            proxy.count++
        })
    })()
}

export const wfSymbolPR = { wfSymbolPR: adnId => wfType.p[adn(adn(adnId).p).r] }
export const wfSymbolR2 = { wfSymbolR2: adnId => wfType[adn(adnId).r2] }
/**
 * ⛋   -- Process in PlanDefinition
 * 𝑓   -- ActivityDefinition
 * 𝑡   -- Task
 */
export const wfType = {
    2001: '𝑡→', 2002: '𝑓→', 2003: '[]', 2004: '[]'
    , p: { 2003: '⛋', 2004: '⛋' }
}
/**
 * 
 * @param {*} parentId 
 * @returns 
 */
export const childTaskId = {
    childTaskId: parentId => parentChilds(parentId)
        .find(i => domConstants.TaskIdList.includes(adn(i).r))
}
/**
 * 
 */
domConstants.ActivityDefinitionIdList = [2002]
domConstants.TaskIdList = [2001]
domConstants.TaskIOAutoExecute = [2005]

export const TaskTagIds = domConstants.TaskTagIds = [2005]

import { mcDataMethods, } from '/f/7/libDomGrid/libDomGrid.js'
import { setDomComponent } from '/f/7/libDomGrid/libDomGrid.js'
import { cpSymbolR } from '/f/7/cp01view/libCP.js'

/**
 * CarePlan body
 */
export const CpBody = {
    props: { rootId: Number }, data() { return { count: 0, } },
    mounted() { setDomComponent('cpBody', this) }, methods: Object.assign({
        basedOnCP: () => getDomConf('cp') && getDomConf('cp').basedOnCP || []
    }, mcDataMethods, cpSymbolR), template: `
<div v-if="parentChilds(rootId)" class="w3-container w3-border-left">
    <div v-for="adnId in parentChilds(rootId)">
        <span class="w3-tiny w3-opacity">{{adnId}}&nbsp;</span>
        <span class="w3-small w3-opacity">
            :{{cpSymbolR(adnId)}}.{{adn(adnId).r2}}&nbsp;</span>
        <a :href="'/f/7/wf02view/i.html#wf,'+adn(adnId).r2" class="w3-small">
            {{adn(adn(adnId).r2).vl_str}} </a> </div></div>
<div v-if="basedOnCP()" class="w3-border-left">
    <template v-for="boaId in basedOnCP()">
        <template v-if="adn(boaId).r2==rootId">
            <div class="w3-border-top">
                &nbsp;<span class="w3-tiny w3-opacity">{{boaId}}</span>
                {{adn(boaId).vl_str}} </div>
            <div v-if="parentChilds(boaId)" class="w3-border-top w3-container">
                <div v-for="boId in parentChilds(boaId)" class="w3-hover-shadow">
                    <span class="w3-tiny w3-opacity">{{boId}}</span>
                    {{adn(boId).vl_str}} </div> </div> </template> </template>
</div><span class="w3-hide">{{count}}</span>`,
}

    /**
     * 
     */
    , TitSelect = {
        props: { taskIcId: Number }, data() { return { count: 0 } },
        computed: {
            pdActionIds() {
                return parentChilds(parentChilds(adn(this.activityDefinitionId()).p)
                    .find(i => '[]' == wfType[adn(i).r]))
            },
        }, mounted() { initTaskIc(this.taskIcId, this) }, methods: Object.assign({
            findBtnAdId: pdActionId => findAdInPDAction(pdActionId)
            , activityDefinitionId() { return adn(this.taskIcId).p }
            , clickAdBtn(adId) {
                console.log(adId, adn(adId))
            }, actionData() {
                return getDomConf('wf').actionData && getDomConf('wf')
                    .actionData[this.activityDefinitionId()] || {}
            }, setSelectedId(adnId) {
                console.log(adnId, getDomConf('wf'), wfType)
                this.actionData().selectedId = adnId
                this.count++
            }, isSelectedId(adnId) { return this.actionData().selectedId == adnId }
            ,
        }, mcDataMethods), template: `
<div class="w3-border-top w3-container">
    <span class="w3-tiny w3-right">{{taskIcId}}:TitSelect:{{count}}</span>
    <div class="w3-border-bottom w3-leftbar">
        <div v-for="pdActionId in pdActionIds">&nbsp;
            <span class="w3-tiny">{{pdActionId}}</span>
            {{adn(pdActionId).vl_str}}
            <button @click="clickAdBtn(findBtnAdId(pdActionId))" class="w3-leftbar">
                {{adn(findBtnAdId(pdActionId)).vl_str}}
            </button>
        </div>
    </div>
    <div @click="setSelectedId(im.doc_id)" v-for="im in actionData().list" class="w3-hover-shadow"
        :class="{'w3-light-grey':isSelectedId(im.doc_id)}">
        <span class="w3-tiny">{{im.doc_id}}</span>
        {{im.vl_str}}
    </div>
</div>`,
    }

    /**
     * WorkFlow.PlanDefinition part - try dynamic component
     */
    , WfPart = {
        template: `<component :is="taskTagName()" :taskIcId="taskIcId()"></component>`,
        props: { adnid: Number }, methods: {
            taskIcId() { return childTaskId.childTaskId(this.adnid) },
            taskId() { return adn(this.taskIcId()).r2 },
            taskTagName() {
                const taskTagId = taskIOCmd(parentChilds(this.taskId())
                    .find(i => TaskTagIds.includes(taskIOCmd(i))))
                return this.taskId() && adn(taskTagId).vl_str.replace('.', '')
            },
        }, components: { TitSelect },
    }
    /**
     * WorkFlow.PlanDefinition -- usage in EMR
     */
    , Wf02Use = {
        data: () => { return { count: 0, rootId: getDomConf('wf') && getDomConf('wf').l[0] } },
        mounted() { setDomComponent('wf02use', this) }, methods: Object.assign({
            isSelectedActionId: adnId => getDomConf('wf').selectedActionId && getDomConf('wf')
                .selectedActionId.includes(adnId),
            onOffAction(adnId) {
                console.log(adnId, getDomConf('wf').selectedActionId)
                const selectedActionId = getDomConf('wf').selectedActionId || (getDomConf('wf').selectedActionId = [])
                !selectedActionId.includes(adnId) && selectedActionId.push(adnId)
                    || selectedActionId.splice(selectedActionId.indexOf(), 1)
                this.count++
            },
        }, mcDataMethods, wfSymbolR2, wfSymbolPR, childTaskId),
        // <span class="w3-tiny w3-opacity w3-right"> {{count}} </span>
        components: { WfPart }, template: `
<h6 :review="count" class="w3-border-bottom">
    <span class="w3-tiny w3-opacity">{{rootId}} 🮿&nbsp;</span>
    <span class="am-i">{{adn(rootId).vl_str}}</span>
</h6>
<template v-for="adnId in parentChilds(parentChilds(rootId)[0])">
    <div class="w3-hover-shadow" @click="onOffAction(adnId)">
        <span class="w3-tiny">{{adnId}}&nbsp;{{wfSymbolPR(adnId)}}</span>
        {{adn(adnId).vl_str}}
    </div>
    <div v-if="isSelectedActionId(adnId)" class="w3-border-left w3-container">
        <div v-for="adnId2 in parentChilds(adnId)">
            <span class="w3-tiny">{{adnId2}}&nbsp;{{wfSymbolR2(adnId2)}}</span>
            {{adn(adnId2).vl_str}}
            <WfPart :adnid="adnId2"></WfPart>
        </div></div>
</template>`,
    }
