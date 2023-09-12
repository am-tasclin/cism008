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
        wfSymbolR(adnId) { return wfType[this.adn(adnId).r] },
        wfSymbolR2(adnId) { return wfType[this.adn(adnId).r2] },
    }, template: `
<div v-if="parentChilds(adnid).length" class="w3-container w3-border-left">
    <template v-for="adnId2 in parentChilds(adnid)">
        <div class="w3-hover-shadow">
            <span class="w3-tiny">
                {{adnId2}}&nbsp;{{wfSymbolR(adnId2)}}{{wfSymbolR2(adnId2)}}
            </span> {{adn(adnId2).vl_str}}
            <span class="w3-right w3-tiny w3-opacity">
            {{adn(adnId2).r}}|{{adn(adnId2).r2}}
            </span>
        </div>
        <t-wf :adnid="adnId2"></t-wf>
    </template>
</div><span class="w3-hide">{{count}}</span>
`,
}
/**
 * ⛋ -- Process in PlanDefinition
 * 𝑓 -- ActivityDefinition
 * 𝑡 -- Task
 */
const wfType = { 369782: '⛋', 371575: '⛋', 373500: '𝑓→', 371927: '𝑡→' }