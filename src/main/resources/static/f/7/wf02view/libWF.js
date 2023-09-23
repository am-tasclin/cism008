'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { executeSelectQuery } from '/f/7/libDbRw/wsDbRw.js'
import { readOntologyTree, initNamedSql } from '/f/7/libDbRw/libMcRDb.js'
import { domConfCP, adnIds, adn, parentChilds, domConfWf, domConstants, getDomComponent } from
    '/f/7/libDomGrid/libDomGrid.js'
/**
 * Build CarePlan Meta-Content code
 * @param {Array} l 
 * @returns 
 */
export const initCarePlan = l => readOntologyTree(l, initAfterCarePlan)
const initAfterCarePlan = () => {
    domConfCP().reView.initAfterCarePlan && domConfCP().reView.initAfterCarePlan()
    const r2List = adnIds().reduce((l, i) => adn(i).r2 && l.push(adn(i).r2) && l || l, [])
    console.log(r2List)
    readOntologyTree(r2List, initAfterCpR2)
}, initAfterCpR2 = () => {
    domConfCP().reView.initAfterCarePlan && domConfCP().reView.initAfterCarePlan()
    // console.log('find basedOn this CarePlan?')
    const sql = selectOnBasedOnMaker.get().replace(':idList', domConfCP().l.join(','))
    // console.log(sql)
    executeSelectQuery(sql).then(json => {
        const parentIds = json.list.reduce((l, o) => l.push(o.doc_id) && l, [])
        domConfCP().basedOnCP = parentIds
        // console.log(parentIds, json)
        readOntologyTree(parentIds, afterBasedOn)
    })
}, afterBasedOn = (x, deepCount) => {
    domConfCP().reView.initAfterCarePlan && domConfCP().reView.initAfterCarePlan()
    console.log(x, deepCount)

}
import { initSelectMaker } from '/f/7/libDbRw/libSqlMaker.js'
const selectOnBasedOnMaker = initSelectMaker('selectOnBasedOn', 'doc')
    .initColumns('doc_id').initLeftJoin(
        '(SELECT doc_id basedon_id FROM doc WHERE reference=2014) x', 'reference=basedon_id')
    .initWhere('reference2 IN (:idList)').andWhere('reference!=2008') //Encounter.basedOn

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
export const initWorkFlow = l => readOntologyTree(l, initAfterPD)
/**
 * library: initWorkFlow
 */
const initAfterPD = (x, deepCount) => {
    console.log(deepCount)
    Object.keys(domConfWf().wfComponent).forEach(i =>
        domConfWf().wfComponent[i].count++)

    console.log(domConfWf().reView)

    domConfWf().reView.initAfterPD && domConfWf().reView.initAfterPD()
    readOntologyTree(codeMetaDataIds, initCodeMetaData)
}, initCodeMetaData = (x, deepCount) => {
    console.log(deepCount)
    componentCMD.forEach(n => getDomComponent(n) &&
        getDomComponent(n).count++)
    // getDomComponent('ccr') && getDomComponent('ccr').count++
    const taskList = adnIds().reduce((l, i) => domConstants.TaskIdList
        .includes(adn(i).r) && l.push(adn(i).r2) && l || l, [])
    readOntologyTree(taskList, initAfterTask)
}, initAfterTask = (x, deepCount) => {
    console.log(deepCount)
    console.log(x, domConfWf().codes, domConfWf().taskComponent)
    Object.keys(domConfWf().taskComponent).forEach(i =>
        domConfWf().taskComponent[i].count++)
}
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
