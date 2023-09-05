'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { mcData, confHew, reViewActivePanel, getDomComponent, setActiveEditObjName } from '/f/7/libDomGrid/libDomGrid.js'
import { readAdnByParentIds } from '/f/7/libDbRw/libMcRDb.js'

export default {
    props: { hewid: Number, hewdocid: Number }, data() { return { count: 0, } },
    mounted() { confHew().hewComponent[this.hewid] = this }, methods: {
        isTag(adnId) { return idsTag[mcData.eMap[adnId] && mcData.eMap[adnId].r] },
        is(v) { return is(v, this.hew()) },
        hew() { return mcData.eMap[this.hewid] || {} },
        childIds() { return mcData.parentChilds[this.hewid] || [] },
        clickNoTag() {
            !mcData.parentChilds[this.hewid] && readAdnByParentIds([this.hewid]).then(() => {
                confHew().hewComponent[this.hewid].count++
                reViewActivePanel(this.hewid, 'Hew')
            })
        },
    }, template: `
<HtmlTag v-if="isTag(hewid)" :adnId="hewid" />
<span v-else @click="clickNoTag" class="w3-tiny w3-opacity w3-right w3-hover-shadow">
    tag?:{{hewid}}
</span>
<template v-for="hewId2 in childIds()">
    <t-hew :hewid="hewId2" :hewdocid="hewdocid" ></t-hew>
</template>
<span class="w3-hide">{{count}}</span>`,
    components: {
        'HtmlTag': {
            props: { adnId: Number },
            data() { return { count: 0 } },
            computed: { tagName() { return idsTag[mcData.eMap[this.adnId].r] } }, methods: {
                click() {
                    console.log(this.adnId, 1 * this.adnId, mcData.eMap[this.adnId])
                    mcData.parentChilds[this.adnId] &&
                        mcData.parentChilds[this.adnId].forEach(adn2Id => {
                            console.log(mcData.eMap[adn2Id])
                        });
                    //reViewActivePanel(this.adnId, 'Hew')
                    setActiveEditObjName('Hew')
                    getDomComponent('actuallyEdit').count++
                },
                vlStr() { return mcData.eMap[this.adnId].vl_str }
            }, template: `
<component :is="tagName" :review="count" @click="click" class="w3-hover-shadow">
    <span class="w3-tiny w3-right w3-opacity">{{adnId}}.</span>
    {{vlStr()}}
</component>`,
        },
    },
}

const idsTag = { 376600: 'h1', 371359: 'p' }
