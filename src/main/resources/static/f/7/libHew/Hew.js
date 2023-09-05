'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { mcData, domConfHew, domConfHrefHash, getDomComponent, setActiveEditObjName } from
    '/f/7/libDomGrid/libDomGrid.js'
import { readAdnByParentIds } from '/f/7/libDbRw/libMcRDb.js'

export default {
    props: { hewid: Number, hewdocid: Number }, data() { return { count: 0, } },
    mounted() { domConfHew().hewComponent[this.hewid] = this }, methods: {
        isTag(adnId) { return idsTags[mcData.eMap[adnId] && mcData.eMap[adnId].r] },
        is(v) { return is(v, this.hew()) },
        hew() { return mcData.eMap[this.hewid] || {} },
        childIds() { return mcData.parentChilds[this.hewid] || [] },
        clickNoTag() {
            !mcData.parentChilds[this.hewid] && readAdnByParentIds([this.hewid]).then(() => {
                domConfHew().hewComponent[this.hewid].count++
                // reViewActivePanel(this.hewid, 'Hew')
            })
        },
    }, template: `
<HtmlTag v-if="isTag(hewid)" :adnId="hewid" :hewdocid="hewdocid"/>
<span v-else @click="clickNoTag" class="w3-tiny w3-opacity w3-right w3-hover-shadow">
    tag?:{{hewid}}
</span>a1-{{hewid}}-{{count}}
<template v-for="hewId2 in childIds()">
    <t-hew :hewid="hewId2" :hewdocid="hewdocid" ></t-hew>
</template> <span class="w3-hide">{{count}}</span>`, components: {
        'HtmlTag': {
            props: { adnId: Number, hewdocid: Number }, data() { return { count: 0 } },
            mounted() { domConfHew().hewTagComponent[this.adnId] = this },
            computed: { tagName() { return idsTags[mcData.eMap[this.adnId].r] } }, methods: {
                clickTag() {
                    // console.log(this.adnId, 1 * this.adnId, mcData.eMap[this.adnId])
                    // mcData.parentChilds[this.adnId] && mcData.parentChilds[this.adnId]
                    //     .forEach(adn2Id => console.log(mcData.eMap[adn2Id]))
                    //reViewActivePanel(this.adnId, 'Hew')
                    const oldSelectedId = domConfHew().selectedId;
                    setActiveEditObjName('Hew')
                    domConfHew().selectedId = this.adnId
                    domConfHew().selectedRootId = this.hewdocid
                    getDomComponent('actuallyEdit').count++
                    // getDomComponent('rootHew').count++

                    domConfHew().hewTagComponent[this.adnId] &&
                        domConfHew().hewTagComponent[this.adnId].count++

                    domConfHew().hewTagComponent[oldSelectedId] &&
                        domConfHew().hewTagComponent[oldSelectedId].count++
                    domConfHrefHash()
                },
                isSelected() { return domConfHew() && domConfHew().selectedId == this.adnId },
                vlStr() { return mcData.eMap[this.adnId].vl_str },
            }, template: `
<component :is="tagName" :review="count" @click="clickTag" class="w3-hover-shadow"
        :class="{'w3-light-grey':isSelected(),'w3-white':!isSelected()}">
    <span class="w3-tiny w3-right w3-opacity">{{adnId}}.{{count}}</span>
    {{vlStr()}}
</component> <span class="w3-hide">{{count}}</span>`,
        },
    },
}

const idsTags = { 376600: 'h1', 371359: 'p' }

