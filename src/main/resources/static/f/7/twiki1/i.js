'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { ws } from '/f/7/libDbRw/wsDbRw.js'
import { readAdnByIds, readAdnByParentIds } from '/f/7/libDbRw/libMcRDb.js'
import { initDomConfLogic, domConfHew, mcData } from '/f/7/libDomGrid/libDomGrid.js'
initDomConfLogic(window.location.hash.substring(1))
const uniqueIdsForDbRead = domConfHew().l

console.log(uniqueIdsForDbRead, 123)

ws.onopen = event =>
    uniqueIdsForDbRead.length && readAdnByIds(uniqueIdsForDbRead
    ).then(() => readAdnByParentIds(uniqueIdsForDbRead
    ).then(() => uniqueIdsForDbRead.forEach(hewId => domConfHew().hewComponent[hewId].count++)
    ).then(() => {
        const unqParentId_l = uniqueIdsForDbRead.reduce((l, im) => mcData.parentChilds[im]
            .reduce((l1, im1) => !l1.includes(im1) && l1.push(im1) && l1 || l1, l) && l, [])
        readAdnByParentIds(unqParentId_l).then(() => {
            console.log(unqParentId_l)
            unqParentId_l.forEach(hewId => domConfHew().hewComponent[hewId].count++)
        })
    }))

import Hew from './Hew.js'
const { createApp } = Vue

createApp({
    methods: {
        hew_l() { return domConfHew().l }
    },
}).component('t-hew', Hew).mount('#hew')

createApp({
    data() { return { count: 0, hewId: 0, } },
    methods: {
        setHewId() {
            console.log(this.hewId)
            window.location.href = '#hew,' + this.hewId
        },
    }
}).mount('#actuallyEdit')
