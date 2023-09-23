'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { readOntologyTree } from '/f/7/libDbRw/libMcRDb.js'
import { adnIds, adn, parentChilds, domConfWf, domConstants, getDomComponent } from
    '/f/7/libDomGrid/libDomGrid.js'

export const initWorkFlow = () =>
    readOntologyTree(domConfWf().l, readAfterPD)
    , codeRepresentation = [377146,]
    , loggedAttributes = [372052, 377121, 377149, 377170, 377176]
    , codeMetaDataIds = codeRepresentation.concat(loggedAttributes)
const readAfterPD = (x, deepCount) => {
    console.log(deepCount)
    Object.keys(domConfWf().wfComponent).forEach(i =>
        domConfWf().wfComponent[i].count++)

    domConfWf().reView && domConfWf().reView.readAfterPD()
    readOntologyTree(codeMetaDataIds, readCodeMetaData)
}, readCodeMetaData = (x, deepCount) => {
    console.log(deepCount)
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
/**
 * 
 */
domConstants.TaskIdList = [2001]
