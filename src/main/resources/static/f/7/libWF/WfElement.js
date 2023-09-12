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
        wfSymbolPR(adnId) { return wfType.p[this.adn(this.adn(adnId).p).r] },
        hasTask(adnId2) {
            return this.parentChilds(adnId2).find(i => taskElementList.includes(this.adn(i).r))
        },
    }, template: `
<div v-if="parentChilds(adnid).length" class="w3-container w3-border-left">
    <template v-for="adnId2 in parentChilds(adnid)">
        <div class="w3-row" v-if="hasTask(adnId2)">
            <div class="w3-half">
                <div class="w3-hover-shadow">
                    <span class="w3-tiny">{{adnId2}}&nbsp;𝑓→</span>
                    {{adn(adnId2).vl_str}}
                </div>
            </div>
            <div class="w3-half">
                <div class="w3-tiny w3-light-grey"> 𝑡→ Task</div> 
                <div v-for="adnId3 in parentChilds(adnId2)">
                    <span class="w3-tiny">{{adnId3}}&nbsp;𝑡→</span>
                    {{adn(adnId3).r2}}
                </div>
            </div>
        </div>
        <template v-else>
            <div class="w3-hover-shadow">
                <span class="w3-tiny">{{adnId2}}&nbsp;
                    {{wfSymbolPR(adnId2)}}
                    {{wfSymbolR(adnId2)}}{{wfSymbolR2(adnId2)}}
                </span> {{adn(adnId2).vl_str}}
                <!--span class="w3-right w3-tiny w3-opacity">{{adn(adnId2).r}}|{{adn(adnId2).r2}}</span-->
            </div>
            <t-wf :adnid="adnId2"></t-wf>
        </template>
    </template>
</div><span class="w3-hide">{{count}}</span>`,
}
/**
 * 
 */
const taskElementList = [371927]
/**
 * ⛋ -- Process in PlanDefinition
 * 𝑓 -- ActivityDefinition
 * 𝑡 -- Task
 */
const wfType = {
    369782: '[]', 371575: '[]', 373500: '𝑓→', 371927: '𝑡→'
    , p: { 369782: '⛋', 371575: '⛋' }
}