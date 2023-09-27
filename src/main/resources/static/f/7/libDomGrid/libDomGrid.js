'use strict'
/**
 * Algoritmed ©, EUPL-1.2 or later.
 * DOM grid editor logic
 * 
 */
const eMap = {}, parentChilds0 = {}, constants = {}
/**
 * Container of data and structures for build and use the DOM Grid
 * Контейнер даних і структур для створення та використання DOM Grid
 */
const domContainer = {
    conf: {}, mcData: { eMap: eMap, parentChilds: parentChilds0 },
    components: {},
    constants: constants, // MCrDB constants
}
console.log(domContainer)
export const consoleLogDomContainer = () => console.log(domContainer)
export const domConstants = domContainer.constants

export const setActiveEditObjName = activeEditObjName => domConf().activeEditObjName = activeEditObjName
export const setActualeCompomentName = ctName => domContainer.actuallyComponentName = ctName // TO REMOVE
export const getActualeCompomentName = () => domContainer.actuallyComponentName //TO REMOVE
/**
 * DomComponent API
 * @param {*} ctName 
 * @param {*} ct 
 * @returns 
 */
export const setDomComponent = (ctName, ct) =>
    setActualeCompomentName(ctName) && (domContainer.components[ctName] = ct)
export const getDomComponent = (ctName) => domContainer.components[ctName]
export const getDomComponentAll = () => domContainer.components
/**
 * mcData API Wrapper
 */
export const mcData = domContainer.mcData
export const adnIds = () => Object.keys(mcData.eMap)
export const adn = adnId => mcData.eMap[adnId] || {}
export const parentChilds = adnId => mcData.parentChilds[adnId] || []
export const notParentChilds = adnId => !mcData.parentChilds[adnId]
export const mcDataMethods = {
    adn: adnId => adn(adnId), parentChilds: adnId => parentChilds(adnId),
    mcData: () => mcData,
}
/**
 * 
 */
const domConf = () => domContainer.conf
export const getDomConf = n => domContainer.conf[n]

const domConfStrignifyList = ['mcElement', 'actuallyTreeObj', 'actuallyEdit'
    , 'hewComponent', 'hewTagComponent', 'adnEditPanelSubMenu']
const domConfStrignifyFn = (k, v) => !domConfStrignifyList.includes(k) && v || undefined
export const domConfLocationHash = () => {
    // console.log(domConf())
    // console.log(JSON.stringify(domConf(), domConfStrignifyFn, 2))
    return JSON.stringify(domConf(), domConfStrignifyFn)
}
export const domConfHrefHash = () => window.location.href = '#cj=' + domConfLocationHash()
/**
 * Href hash config for init page
 */
export const domConfStrignify = () => {
    const x = JSON.stringify(domConf(), domConfStrignifyFn, 2)
    domConfHrefHash()
}
/**
 * 
 * @returns 
 */
export const actuallyTreeObj = () => domConf().actuallyTreeObj
export const domConfHew = () => domConf().hew
// export const domConfWf = () => domConf().wf
// export const domConfEMR = () => domConf().emr
// export const domConfCP = () => domConf().cp
// export const confHew = () => domContainer.conf.hew // TO REMOVE
export const setActuallyTreeObjFromPath = pathTreeStr =>
    domConf().actuallyTreeObj = pathTreeStr.split(',')
        .reduce((o, k) => o[k], domContainer.conf)
/**
 * 
 * @param {*} pathTreeStr 
 * @returns 
 */
export const setActuallyTreeObj = pathTreeStr => {
    setActualeCompomentName('tree')
    setActuallyTreeObjFromPath(pathTreeStr)
    // domConf().actuallyTreeObj = pathTreeStr.split(',').reduce((o, k) => o[k], domContainer.conf)
    getDomComponent('actuallyEdit').count++
    getDomComponent('actuallyTreeObj') &&
        getDomComponent('actuallyTreeObj').count++
    return domConf().actuallyTreeObj
}
/**
 * 
 * @param {*} treeRootId 
 * @returns 
 */
export const initActuallyTreeOpenedId = treeRootId => (domConf().actuallyTreeObj.openedId
    || (domConf().actuallyTreeObj.openedId = {}))[treeRootId]
    || (domConf().actuallyTreeObj.openedId[treeRootId] = [])
/**
 * 
 * @param {*} path 
 * @param {*} treeRootId 
 * @param {*} adnId 
 * @returns 
 */
export const treeOpenedChildOnOff = (treeRootId, adnId) => {
    const adnIdi = 1 * adnId
    const actuallyTreeObj = domConf().actuallyTreeObj
    const actuallyTreeOpenedId = initActuallyTreeOpenedId(treeRootId)
    !actuallyTreeOpenedId.includes(adnIdi)
        && actuallyTreeOpenedId.push(adnIdi)
        || (actuallyTreeObj.openedId[treeRootId] = actuallyTreeOpenedId.filter(i => i != adnIdi))
    return actuallyTreeObj.openedId[treeRootId]
}
/**
 * 
 * @param {*} adnId 
 * @param {*} activeEditObjName 
 */
export const reViewActivePanel = (adnId, activeEditObjName) => {// TO REMOVE
    // domConf().activeEditObjName = activeEditObjName
    setActiveEditObjName(activeEditObjName)
    domConf().activeEditId = adnId
    // console.log(domConf())
    getDomComponent('actuallyEdit').count++
    console.log(getDomComponent('TreeEp'), activeEditObjName)
    'Tree' == activeEditObjName && getDomComponent('TreeEp') &&
        getDomComponent('TreeEp').count++
}
/**
 * 
 * @param {*} adnId 
 * @returns 
 */
export const reViewAdn = adnId => actuallyTreeObj().mcElement && Okeys(actuallyTreeObj().mcElement)
    .forEach(rootId => actuallyTreeObj().mcElement[rootId][adnId] &&
        actuallyTreeObj().mcElement[rootId][adnId].count++)

/**
 * 
 * @param {*} adnList 
 * @returns 
 */
export const initNewMc = adnList => adnList.forEach(adn => {
    setToEMap(adn)
    actuallyTreeObj() && reViewAdn(adn.doc_id)
})
/**
 * 
 * @param {*} adn 
 * @returns 
 */
export const setToEMap = adn => mcData.eMap[adn.doc_id] = adn
/**
 * 
 * @param {*} adnList 
 * @returns 
 */
export const addNewMc = adnList => adnList .forEach(adn => setToEMap(adn))

/**
 * 
 * @param {*} adnId 
 */
export const setUpOneLevel = (adnId, oldRootId) => {
    console.log(adnId, oldRootId, domConf().pathActuallyTreeObj, actuallyTreeObj())
    actuallyTreeObj().rootList.find((v, p) =>
        v == oldRootId && (actuallyTreeObj().rootList[p] = adnId))
    actuallyTreeObj().openedId[oldRootId].push(adnId)
    actuallyTreeObj().openedId[adnId] =
        actuallyTreeObj().openedId[oldRootId]
    delete actuallyTreeObj().openedId[oldRootId]
    actuallyTreeObj().selectedRootId =
        actuallyTreeObj().selectedId = adnId
    getDomComponent('treeDom').count++
    getDomComponent('actuallyTreeObj').count++
    domConfHrefHash()
}
/**
 * Make one deep child as new rootTreeId
 * @param {*} adnId 
 */
export const setTakeToRoot = adnId => {
    const oldRootId = mcData.eMap[adnId].p
    const deleteOthers = (p, fn) => {
        fn(p)
        return p.filter(i => mcData.parentChilds[i]).reduce((l, i) =>
            l.concat(mcData.parentChilds[i]), [])
    }, deleteOthersDeep = (p, fn) => {
        const p2 = deleteOthers(p, fn)
        return p2.length && deleteOthersDeep(p2, fn)
    }
    const parentChildsWIthoutNewRoot = mcData.parentChilds[oldRootId].filter(i => i != adnId)
    const mcElList = actuallyTreeObj().mcElement[oldRootId]
    deleteOthersDeep(parentChildsWIthoutNewRoot, p => Okeys(mcElList)
        .forEach(i => p.find(i1 => i1 == i && delete mcElList[i])))
    delete mcElList[oldRootId]
    actuallyTreeObj().mcElement[adnId] = mcElList
    delete actuallyTreeObj().mcElement[oldRootId]
    const newOpenerId = actuallyTreeObj().openedId[oldRootId]
    deleteOthersDeep(parentChildsWIthoutNewRoot, p =>
        p.filter(i => newOpenerId.indexOf(i) > 0).forEach(i =>
            newOpenerId.splice(newOpenerId.indexOf(i), 1)))
    newOpenerId.splice(newOpenerId.indexOf(oldRootId), 1)
    actuallyTreeObj().openedId[adnId] = actuallyTreeObj().openedId[oldRootId]
    delete actuallyTreeObj().openedId[oldRootId]
    actuallyTreeObj().rootList.splice(actuallyTreeObj().rootList.indexOf(oldRootId), 1, adnId)
    actuallyTreeObj().selectedRootId =
        actuallyTreeObj().selectedId = adnId
    getDomComponent('treeDom').count++
    getDomComponent('actuallyTreeObj').count++
    domConfHrefHash()
}
/**
 * 
 * @returns 
 */
export const uniqueIdPageRead = () => Okeys(domContainer.conf.tree)
    .reduce((l, im) => domContainer.conf.tree[im].rootList.filter(im2 => !l.includes(im2))
        .reduce((l, im2) => l.push(im2) && l, l) && l, [])
/**
 * 
 * @returns 
 */
export const uniqueTreeOpenedId = () => Okeys(domConf().tree)
    .reduce((l1, treeId) => domConf().tree[treeId].openedId && Okeys(domConf().tree[treeId].openedId)
        .reduce((l2, treeRootId) => domConf().tree[treeId].openedId[treeRootId]
            .reduce((l3, i) => !l3.includes(i) && l3.push(i) && l3 || l3
                , l2) && l2, l1) && l1 || l1, [])
/**
 * Short to tree configuration
 * @returns 
 */
export const confTree = () => domContainer.conf.tree
/**
 * 
 * @param {*} rawConfStr 
 */
export const initDomConfLogic = rawConfStr => rawConfStr.includes('cj=') && initJsonDomConf(rawConfStr.replace('cj=', ''))
    || initUriDomConf(rawConfStr)
/**
 * 
 * @param {*} rawConfStr 
 * @returns 
 */
const initJsonDomConf = rawConfStr => {
    const confJson = JSON.parse(decodeURI(rawConfStr))
    domContainer.conf.tree = confJson.tree
    domContainer.conf.hew = confJson.hew
    domContainer.conf.hew && (domContainer.conf.hew.hewComponent = {})
    domContainer.conf.hew && (domContainer.conf.hew.hewTagComponent = {})
    // !ppId && (ppId = Okeys(domConf().tree)[0])
    const ppId = Okeys(domConf().tree)[0]
    domContainer.conf.actuallyTreeObj = domContainer.conf.tree[ppId]
    domContainer.conf.pathActuallyTreeObj = 'tree,' + ppId
    console.log(domContainer.conf.pathActuallyTreeObj, domContainer)
    //setActuallyTreeObj(pathTreeStr)
    return domContainer.conf
}
/**
 * 
 * @returns 
 */
export const pathActuallyTreeObj = () => domContainer.conf.pathActuallyTreeObj
/**
 * Primary initialization from simple URI syntax
 * Первинна ініціалізація з простого синтаксису URI
 * 
 * @param {*} rawUriDomConf 
 * @param {*} ppId 
 */
const initUriDomConf = (rawUriDomConf, ppId) => {
    !ppId && (ppId = 0)
    // console.log(uriDomConf_l, ppId, 'hew' == uriDomConf_l[0]);
    rawUriDomConf.split(';').forEach(rawUriDomConf1 => {
        const uriDomConf_l = rawUriDomConf1.split(',')
        'hew' == uriDomConf_l[0] && initHewUriDomConf(uriDomConf_l
        ) || 'wf' == uriDomConf_l[0] && initConfTypePartList(uriDomConf_l
        ) || 'emr' == uriDomConf_l[0] && initConfTypePartList(uriDomConf_l
        ) || 'cp' == uriDomConf_l[0] && initConfTypePartList(uriDomConf_l
        ) || initTreeUriDomConf(uriDomConf_l, ppId)
    })
    return domContainer.conf
}

const domConfPart = {
    wf: { l: [], wfComponent: {}, taskComponent: {}, taskWfExe:{}, reView: {}, },
    cp: { l: [], reView: {}, },
    emr: { l: [], reView: {}, },
}
export const initDomConfPart = (n) => domContainer.conf[n] || (
    domContainer.conf[n] = domConfPart[n])

const initConfTypePartList = (uriDomConf_l) => {
    const confPart = initDomConfPart(uriDomConf_l[0])
    uriDomConf_l.slice(1).forEach(im => !confPart.l.includes(im) && confPart.l.push(im))
}
/**
 * 
 * @param {*} uriDomConf_l 
 * @param {*} ppId 
 */
const initTreeUriDomConf = (uriDomConf_l, ppId) => {
    domContainer.conf.pathActuallyTreeObj = 'tree,' + ppId
    'tree' == uriDomConf_l[0] && ((
        domContainer.conf.tree || (domContainer.conf.tree = {})
    )[ppId] = { rootList: uriDomConf_l.slice(1) }
    ) && (domContainer.conf.actuallyTreeObj = domContainer.conf.tree[ppId])
        || (() => {
            domContainer.conf.tree = {}
            // console.log(domContainer)
        })();
    // console.log(JSON.stringify(domContainer.conf, '', 2))
}
/**
 * 
 * @param {*} uriDomConf_l 
 * @returns 
 */
const initHewUriDomConf = (uriDomConf_l) => {
    const hew = domContainer.conf.hew
        || (domContainer.conf.hew = { l: [], hewComponent: {}, hewTagComponent: {}, })
    uriDomConf_l.slice(1).forEach(im => !hew.l.includes(im) && hew.l.push(im))
    return true
}
/**
 * 
 * @param {*} addTreeId 
 */
export const addTreeFn = addTreeId => {
    const addTreeIdi = 1 * addTreeId
    !Okeys(domContainer.conf.tree).length && (domContainer.conf.tree = { 0: {} })
    const firstRootTreeId = Okeys(domContainer.conf.tree)[0];

    (domContainer.conf.tree[firstRootTreeId].rootList
        || (domContainer.conf.tree[firstRootTreeId].rootList = []))
    !domContainer.conf.tree[firstRootTreeId].rootList.includes(addTreeIdi)
        && domContainer.conf.tree[firstRootTreeId].rootList.push(addTreeIdi)
    const pathTreeStr = 'tree,' + firstRootTreeId
    setActuallyTreeObj(pathTreeStr)
}

const Okeys = Object.keys
