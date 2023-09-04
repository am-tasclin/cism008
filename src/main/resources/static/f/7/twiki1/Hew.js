'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { mcData, confHew } from '/f/7/libDomGrid/libDomGrid.js'
const idsTag = { 376600: 'h1', 371359: 'p' }

export default {
    props: { hewid: Number }, data() { return { count: 0, } },
    components: {
        'HtmlTag': {
            props: { adnId: Number },
            data() { return { count: 0 } },
            computed: {
                tagName() {
                    console.log(this.adnId, 123)
                    return idsTag[mcData.eMap[this.adnId].r]
                }
            }, methods: {
                click() {
                    console.log(this.adnId, 1 * this.adnId, mcData.eMap[this.adnId])
                },
                vlStr() { return mcData.eMap[this.adnId].vl_str }
            }, template: `
<component :is="tagName" :review="count" @click="click"
        class="w3-hover-shadow">
    <span class="w3-tiny w3-right w3-opacity">{{adnId}}.</span>
    {{vlStr()}}
</component>`,
        },
    }, mounted() {
        confHew().hewComponent[this.hewid] = this
    }, methods: {
        isTag(adnId) { return idsTag[mcData.eMap[adnId] && mcData.eMap[adnId].r] },
        is(v) { return is(v, this.hew()) },
        hew() { return mcData.eMap[this.hewid] || {} },
        childIds() { return mcData.parentChilds[this.hewid] || [] },
    }, template: `
<HtmlTag v-if="isTag(hewid)" :adnId="hewid" />
<span v-else class="w3-tiny w3-opacity w3-right">
    tag?:{{hewid}}
</span>
<template v-for="hewId2 in childIds()">
    <t-hew :hewid="hewId2"></t-hew>
</template>
<span class="w3-hide">{{count}}</span>`,
}