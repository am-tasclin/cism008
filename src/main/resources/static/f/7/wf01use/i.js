'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import {
    initDomConfLogic, mcData, setDomComponent,
} from '/f/7/libDomGrid/libDomGrid.js'
const domConf = initDomConfLogic(window.location.hash.substring(1))
console.log(domConf, mcData)

const codeMetaData = [368597, 367562,]
    , codeRepresentation = [377146,]
domConf.wf.codes = codeMetaData.concat(codeRepresentation)
domConf.wf.loggedAttributes = [372052, 377121, 377149, 377170]

import { ws } from '/f/7/libDbRw/wsDbRw.js'
import { initWorkFlow } from '/f/7/wf01view/libWF.js'
ws.onopen = event => initWorkFlow()