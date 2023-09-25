'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { initDomConfLogic } from '/f/7/libDomGrid/libDomGrid.js'
initDomConfLogic(window.location.hash.substring(1))

import { getDomConf } from '/f/7/libDomGrid/libDomGrid.js'
console.log(getDomConf('emr'))
