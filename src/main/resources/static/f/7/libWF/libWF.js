'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
// DEPRECATED
import { adnIds, adn, parentChilds, notParentChilds, domConfWf, domConstants, } from
    '/f/7/libDomGrid/libDomGrid.js'
import { readAdnByIds, readAdnByParentIds, initNamedSql } from '/f/7/libDbRw/libMcRDb.js'

// console.log(wfType, Object.keys(wfType))
export const wfSymbolPR = { wfSymbolPR: adnId => wfType.p[adn(adn(adnId).p).r] }
export const wfSymbolR2 = { wfSymbolR2: adnId => wfType[adn(adnId).r2] }
/**
 * 
 * @param {*} parentId 
 * @returns 
 */
export const childTaskId = {
    childTaskId: parentId => parentChilds(parentId
    ).find(i => domConstants.TaskIdList.includes(adn(i).r))
}
export const taskIOCmd = adnId => adn(adn(adn(adnId).r2).r2).p
/**
 * 
 */
domConstants.TaskIdList = [2001]
domConstants.ActivityDefinitionIdList = [2002]
domConstants.TaskIOAutoExecute = [2005]
export const TaskTagIds = domConstants.TaskTagIds = [2005]
/**
 * ⛋   -- Process in PlanDefinition
 * 𝑓   -- ActivityDefinition
 * 𝑡   -- Task
 */
export const wfType = {
    2001: '𝑡→', 2002: '𝑓→', 2003: '[]', 2004: '[]'
    , p: { 2003: '⛋', 2004: '⛋' }
}

import { executeSelectQuery, } from '/f/7/libDbRw/wsDbRw.js'
// import { taskIOCmd, } from '/f/7/libWF/WfElement.js'
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
/**
 * 
 * @param {*} adnId 
 * @returns 
export const pdActionByOpen = (adnId, proxy) => findTasksInPDAction(adnId, proxy, initTaskIc)
 */
/**
 * Find ActivityDefinition in PlanDefinition.action
 * @param {Number} pdActionId 
 * @returns 
 */
export const findAdInPDAction = pdActionId => parentChilds(pdActionId)
    .find(i => domConstants.ActivityDefinitionIdList.includes(adn(i).r2))
/**
 * 
 * @param {Number} adId 
 */
export const findTaskInAD = adId => parentChilds(adId)
    .find(i => domConstants.TaskIdList.includes(adn(i).r2))
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

export const initWorkFlow = () => domConfWf().l.length && readAdnByIds(domConfWf().l)
    .then(() => deepN_readParent(deepNum, domConfWf().l, [], readTasks))


const readTasks = (x, deepCount) => {
    const taskList = adnIds().reduce((l, i) => domConstants.TaskIdList
        .includes(adn(i).r) && l.push(adn(i).r2) && l || l, [])
    console.log(deepCount, taskList)
    taskList.length && readAdnByIds(taskList
    ).then(() => deepN_readParent(deepNum, taskList, [], afterReadTasks))
}

const afterReadTasks = (x, deepCount) => readAdnByIds(domConfWf().codes)
    .then(() => deepN_readParent(deepNum, domConfWf().codes, [], afterReadCodes))

const afterReadCodes = (x, deepCount) => readAdnByIds(domConfWf().loggedAttributes)
    .then(() => domConfWf().reView.afterReadCodes && domConfWf().reView.afterReadCodes())

export const deepNum = 6
export const deepN_readParent = (deepCount, list, prevList, fn) => {
    // console.log(deepCount, list, list.length)
    // console.log(deepCount, deepCount == 0, !list.length, deepCount == 0 || !list.length);
    (deepCount == 0 || !list.length) && fn(list, deepCount)
    deepCount > 0 && list.length && readAdnByParentIds(list).then(() => {
        domConfWf().reView && domConfWf().reView.readParent &&
            domConfWf().reView.readParent(list, prevList)
        const newList = adnIds().filter(i => notParentChilds(i) && !prevList.includes(i))
        // console.log(deepCount, newList, newList.length)
        deepN_readParent(--deepCount, newList, list.concat(newList), fn)
    })
}
