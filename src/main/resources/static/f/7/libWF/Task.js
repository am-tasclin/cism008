'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { mcData, domConfWf } from '/f/7/libDomGrid/libDomGrid.js'
export default {
    props: { adnId: Number }, data() { return { count: 0, } },
    mounted() { domConfWf().taskComponent[this.adnId] = this }, methods: {
        adn(adnId) { return mcData.eMap[adnId] || {} },
        parentChilds(adnId) { return mcData.parentChilds[adnId] || [] },
        taskSymbolR(adnId) { return taskType[this.adn(adnId).r] },
    }, template: `
{{adn(adnId).vl_str}}
<div v-if="parentChilds(adnId).length" class="w3-container w3-border-left">
    <div v-for="adnId2 in parentChilds(adnId)">
        <span class="w3-tiny">{{adnId2}}&nbsp;</span>{{taskSymbolR(adnId2)}}
        {{adn(adnId2).vl_str}}
        <span v-if="parentChilds(adnId2)[0]">
            ⇸
            r:{{adn(parentChilds(adnId2)[0]).r}}
            r2:{{adn(parentChilds(adnId2)[0]).r2}}
            ⇸
        </span>
    </div>
</div><span class="w3-hide">{{count}}</span>`,
}
/**
 * 
 */
const taskType = {
    371934: '⇥', 371936: '↦',
}