'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { mcData, domConfWf, domConstants, } from '/f/7/libDomGrid/libDomGrid.js'
import { readAdnByIds, readAdnByParentIds } from '/f/7/libDbRw/libMcRDb.js'
// import {  initNamedSql } from '/f/7/libDbRw/libMcRDb.js'

export const initWorkFlow = () => domConfWf().l.length && readAdnByIds(domConfWf().l
).then(() => deepN_readParent(deepNum, domConfWf().l, [], readTasks))

const readTasks = (x, deepCount) => {
    // console.log('afterDeepN --> ', x, deepCount, mcData, domConstants)
    const taskList = Object.keys(mcData.eMap).reduce((l, i) => domConstants.taskElementList
        .includes(mcData.eMap[i].r) && l.push(mcData.eMap[i].r2) && l || l, [])
    // console.log(deepCount, taskList)
    taskList.length && readAdnByIds(taskList
    ).then(() => deepN_readParent(deepNum, taskList, [], afterReadTasks))
}

const afterReadTasks = (x, deepCount) => {
    // console.log(mcData.eMap[377155], mcData.parentChilds[377155])
    // console.log(mcData.eMap[377156], mcData.parentChilds[377156])
    // console.log(34, codes, initNamedSql({ n: 'selectDocVlStrByParentIds', l: [377108] }))
    readAdnByIds(domConfWf().codes).then(() =>
        deepN_readParent(deepNum, domConfWf().codes, [], afterReadCodes))
}

const afterReadCodes = (x, deepCount) => {
    console.log(deepCount, mcData)
    readAdnByIds(domConfWf().loggedAttributes).then(() => {
        domConfWf().reView && domConfWf().reView.afterReadCodes &&
            domConfWf().reView.afterReadCodes()
    })
}

export const deepNum = 6
export const deepN_readParent = (deepCount, list, prevList, fn) => {
    // console.log(deepCount, list, list.length)
    // console.log(deepCount, deepCount == 0, !list.length, deepCount == 0 || !list.length);
    (deepCount == 0 || !list.length) && fn(list, deepCount)
    deepCount > 0 && list.length && readAdnByParentIds(list).then(() => {
        domConfWf().reView && domConfWf().reView.readParent &&
            domConfWf().reView.readParent(list, prevList)
        const newList = Object.keys(mcData.eMap).filter(i => !mcData.parentChilds[i] && !prevList.includes(i))
        // console.log(deepCount, newList, newList.length)
        deepN_readParent(--deepCount, newList, list.concat(newList), fn)
    })
}

/**
 * 
 */
domConstants.taskElementList = [371927]