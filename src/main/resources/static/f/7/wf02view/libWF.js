'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { executeSelectQuery } from '/f/7/libDbRw/wsDbRw.js'
import { readOntologyTree, initNamedSql } from '/f/7/libDbRw/libMcRDb.js'
import { domConfCP, parentChilds, domConfWf, domConstants, getDomComponent } from
    '/f/7/libDomGrid/libDomGrid.js'
import { getDomConf, adnIds, adn, mcData } from
    '/f/7/libDomGrid/libDomGrid.js'


/**
* Build CarePlan Meta-Content code
* @param {Array} l 
* @returns 
*/
//export const initCarePlan = l => readOntologyTree(l, initAfterCarePlan)
export const initAfterCarePlan = () => {
    reViewInit(['cp', 'wf'], 'initAfterCarePlan')
    // domConfCP().reView.initAfterCarePlan && domConfCP().reView.initAfterCarePlan()
    const r2List = adnIds().reduce((l, i) => adn(i).r2 && l.push(adn(i).r2) && l || l, [])
    console.log(r2List)
    readOntologyTree(r2List, initAfterCpR2)
}
const initAfterCpR2 = () => {
    const sql = selectOnBasedOnMaker.get().replace(':idList', domConfCP().l.join(','))
    executeSelectQuery(sql).then(json => {
        const parentIds = json.list.reduce((l, o) => l.push(o.doc_id) && l, [])
        domConfCP().basedOnCP = parentIds
        console.log(parentIds, json)
        readOntologyTree(parentIds, afterBasedOn)
    })
}, afterBasedOn = (x, deepCount) => {
    reViewInit(['cp', 'wf'], 'initAfterCarePlan')
    // domConfCP().reView.initAfterCarePlan && domConfCP().reView.initAfterCarePlan()
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
 * Build PlanDefinition Meta-Content code
 * @param {Array} l 
 * @returns 
 */
//export const initWorkFlow = l => readOntologyTree(l, initAfterPD)
/**
 * library: initWorkFlow
 */
export const initWorkFlowFn = () => {
    getDomConf('wf').startAfterReadOntologyTreeFn = initAfterPD
}
export const initAfterPD = (x, deepCount) => {
    // console.log(deepCount)
    Object.keys(domConfWf().wfComponent).forEach(i =>
        domConfWf().wfComponent[i].count++)
    domConfWf().reView.initAfterPD && domConfWf().reView.initAfterPD()
    readOntologyTree(codeMetaDataIds, initCodeMetaData)
}
const initCodeMetaData = (x, deepCount) => {
    console.log(deepCount)
    componentCMD.forEach(n => getDomComponent(n) &&
        getDomComponent(n).count++)
    // getDomComponent('ccr') && getDomComponent('ccr').count++
    const taskList = adnIds().reduce((l, i) => domConstants.TaskIdList
        .includes(adn(i).r) && l.push(adn(i).r2) && l || l, [])
    readOntologyTree(taskList, initAfterTask)
}, initAfterTask = (x, deepCount) => {
    // console.log(x, domConfWf().codes, domConfWf().taskComponent)
    Object.keys(domConfWf().taskComponent).forEach(i =>
        domConfWf().taskComponent[i].count++)
    executeSelectQuery(selectCarePlanIcPdMaker.get().replace(':planDefinitionIds'
        , domConfWf().l.join(','))).then(json => cpIcPdList(json))
}, cpIcPdList = cpIcPdList => {
    (domConfWf().cpIcPdList = cpIcPdList.list).forEach(cp => mcData.eMap[cp.cp_id] = cp)
    domConfWf().reView.initAfterPD && domConfWf().reView.initAfterPD()
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
            const actionData = domConfWf().actionData || (domConfWf().actionData = {})
                , activityDefinitionId = adn(taskIcId).p
            actionData[activityDefinitionId] = json
            console.log(activityDefinitionId, taskIcId, domConfWf())
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
 * 
 */
export const CpBody = {
    data() { return { count: 0, } },
    mounted() { setDomComponent('cpBody', this) }, methods: Object.assign({
        basedOnCP: () => domConfCP() && domConfCP().basedOnCP || []
    }, mcDataMethods, cpSymbolR), props: { rootId: Number }, template: `
<div v-if="parentChilds(rootId)" class="w3-container w3-border-left">
    <div v-for="adnId in parentChilds(rootId)">
        <span class="w3-tiny w3-opacity">{{adnId}}&nbsp;</span>
        <span class="w3-small w3-opacity">
            :{{cpSymbolR(adnId)}}.{{adn(adnId).r2}}&nbsp;</span>
        <a :href="'/f/7/wf02view/i.html#wf,'+adn(adnId).r2" class="w3-small">
            {{adn(adn(adnId).r2).vl_str}}
        </a>
    </div>
</div>
<div v-if="basedOnCP()" class="w3-border-left">
    <template v-for="boaId in basedOnCP()">
        <template v-if="adn(boaId).r2==rootId">
            <div class="w3-border-top">
                &nbsp;<span class="w3-tiny w3-opacity">{{boaId}}</span>
                {{adn(boaId).vl_str}}
            </div>
            <div v-if="parentChilds(boaId)" class="w3-border-top w3-container">
                <div v-for="boId in parentChilds(boaId)" class="w3-hover-shadow">
                    <span class="w3-tiny w3-opacity">{{boId}}</span>
                    {{adn(boId).vl_str}}
                </div>
            </div>
        </template>
    </template>
</div><span class="w3-hide">{{count}}</span>`,
}