'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { mcData, domConfWf } from '/f/7/libDomGrid/libDomGrid.js'
export default {
    props: { adnid: Number }, data() { return { count: 0, } },
    mounted() { domConfWf().wfComponent[this.adnid] = this }, methods: {
        adn(adnId) { return mcData.eMap[adnId] || {} },
        parentChilds(adnId) { return mcData.parentChilds[adnId] || [] },
    }, template: `
<div v-if="parentChilds(adnid).length" class="w3-container w3-border-left">
    <span class="w3-tiny w3-opacity w3-right"> {{adnid}} {{parentChilds(adnid)}} </span>
    <div v-for="adnId2 in parentChilds(adnid)" class="w3-hover-shadow">
        <span class="w3-tiny"> {{adnId2}} </span>
        {{adn(adnId2).vl_str}}
        <t-wf :adnid="adnId2"></t-wf>
    </div>
</div><span class="w3-hide">{{count}}</span>
`,
}