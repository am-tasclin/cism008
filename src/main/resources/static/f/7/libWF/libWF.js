'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { adnIds, adn, parentChilds, notParentChilds, domConfWf, domConstants, } from
    '/f/7/libDomGrid/libDomGrid.js'
import { readAdnByIds, readAdnByParentIds } from '/f/7/libDbRw/libMcRDb.js'

import { wfType } from '/f/7/libWF/WfElement.js'
console.log(wfType, Object.keys(wfType))

export const actionByOpen = adnId => findTaskInPDAction(adnId, inTaskId => {
    console.log(adn(inTaskId))
})
/**
 * 
 */
domConstants.TaskIdList = [371927]
domConstants.ActivityDefinitionIdList = [373500]
/**
 * 
 * @param {*} parentId 
 * @returns 
 */
export const childTaskId = parentId => parentChilds(parentId)
    .find(i => domConstants.TaskIdList.includes(adn(i).r))
/**
 * 
 * @param {*} adnId 
 * @param {*} inTaskFn 
 */
const findTaskInPDAction = (adnId, inTaskFn) => {
    const activityDefinitionId = parentChilds(adnId) && parentChilds(adnId)
        .find(i => domConstants.ActivityDefinitionIdList.includes(adn(i).r2))
    activityDefinitionId &&
        parentChilds(adn(childTaskId(activityDefinitionId)).r2).find(inTaskFn)
}

export const initWorkFlow = () => domConfWf().l.length && readAdnByIds(domConfWf().l)
    .then(() => deepN_readParent(deepNum, domConfWf().l, [], readTasks))

const readTasks = (x, deepCount) => {
    const taskList = adnIds().reduce((l, i) => domConstants.TaskIdList
        .includes(adn(i).r) && l.push(adn(i).r2) && l || l, [])
    // console.log(deepCount, taskList)
    taskList.length && readAdnByIds(taskList
    ).then(() => deepN_readParent(deepNum, taskList, [], afterReadTasks))
}

// import {  initNamedSql } from '/f/7/libDbRw/libMcRDb.js'
// console.log(34, codes, initNamedSql({ n: 'selectDocVlStrByParentIds', l: [377108] }))
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
