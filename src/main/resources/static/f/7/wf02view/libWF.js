'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { executeSelectQuery, } from '/f/7/libDbRw/wsDbRw.js'
import { readOntologyTree, initNamedSql } from '/f/7/libDbRw/libMcRDb.js'
import { adnIds, adn, parentChilds, domConfWf, domConstants, getDomComponent } from
    '/f/7/libDomGrid/libDomGrid.js'

export const codeRepresentation = [377146,]
const loggedAttributes = [372052, 377121, 377149, 377170, 377176]
    , codeMetaDataIds = codeRepresentation.concat(loggedAttributes)

export const initWorkFlow = () =>
    readOntologyTree(domConfWf().l, readAfterPD)

const readAfterPD = (x, deepCount) => {
    console.log(deepCount)
    Object.keys(domConfWf().wfComponent).forEach(i =>
        domConfWf().wfComponent[i].count++)

    domConfWf().reView && domConfWf().reView.readAfterPD()
    readOntologyTree(codeMetaDataIds, readCodeMetaData)
}, readCodeMetaData = (x, deepCount) => {
    console.log(deepCount)
    getDomComponent('ccr') &&
        getDomComponent('ccr').count++
    const taskList = adnIds().reduce((l, i) => domConstants.TaskIdList
        .includes(adn(i).r) && l.push(adn(i).r2) && l || l, [])
    readOntologyTree(taskList, readAfterTask)
}, readAfterTask = (x, deepCount) => {
    console.log(deepCount)
    console.log(x, domConfWf().codes, domConfWf().taskComponent)
    Object.keys(domConfWf().taskComponent).forEach(i =>
        domConfWf().taskComponent[i].count++)
}


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
