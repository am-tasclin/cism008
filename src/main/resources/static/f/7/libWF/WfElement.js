'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { mcData, domConfWf, domConstants, setDomComponent } from '/f/7/libDomGrid/libDomGrid.js'
import Task from '/f/7/libWF/Task.js'
export default {
    props: { adnid: Number }, data() { return { count: 0, } },
    components: { Task, },
    mounted() { domConfWf().wfComponent[this.adnid] = this }, methods: {
        adn(adnId) { return mcData.eMap[adnId] || {} },
        parentChilds(adnId) { return mcData.parentChilds[adnId] || [] },
        wfSymbolR(adnId) { return wfType[this.adn(adnId).r] },
        wfSymbolR2(adnId) { return wfType[this.adn(adnId).r2] },
        wfSymbolPR(adnId) { return wfType.p[this.adn(this.adn(adnId).p).r] },
        hasTask(adnId2) {
            return this.parentChilds(adnId2).find(i => domConstants.taskElementList.includes(this.adn(i).r))
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
                    <div class="w3-hover-shadow">
                        <span class="w3-tiny">
                        {{adnId3}}.{{adn(adnId3).r2}}
                        &nbsp;𝑡→</span>&nbsp;
                        <Task :adnId="adn(adnId3).r2"/>
                    </div>
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
domConstants.taskElementList = [371927]
/**
 * ⛋ -- Process in PlanDefinition
 * 𝑓 -- ActivityDefinition
 * 𝑡 -- Task
 */
const wfType = {
    369782: '[]', 371575: '[]', 373500: '𝑓→', 371927: '𝑡→'
    , p: { 369782: '⛋', 371575: '⛋' }
}
/**
 * 
 */
export const CodeMetaData = {
    props: { cmd: Array }, data() { return { count: 0, } },
    mounted() { setDomComponent('cmd', this) }, methods: {
        adn(adnId) { return mcData.eMap[adnId] || {} },
        parentChilds(adnId) { return mcData.parentChilds[adnId] || [] },
    }, template: `
<div :review="count" v-for="cmdId in cmd">
    <span class="w3-tiny">{{cmdId}}</span>
    {{adn(cmdId).vl_str}}
    <div v-if="parentChilds(cmdId)" class="w3-container w3-border-left">
        <div v-for="adnId in parentChilds(cmdId)">
            <span class="w3-tiny">{{adnId}}</span>
            {{adn(adnId).vl_str}}
            <span v-if="adn(adnId).r">:{{adn(adn(adnId).r).vl_str}}</span>
        </div>
    </div>
</div>`,
}
/**
 * 
 */
export const CodeableConceptRepresentation = {
    props: { cr: Object }, data() { return { count: 0, } },
    mounted() { setDomComponent('ccr', this) }, methods: {
        adn(adnId) { return mcData.eMap[adnId] || {} },
        parentChilds(adnId) { return mcData.parentChilds[adnId] || [] },
    }, template: `
<table :review="count" v-for="crId in cr" class="w3-small am-width-100pr" >
    <caption class="w3-light-grey">{{crId}} {{adn(crId).vl_str}}</caption>
    <tr class="w3-tiny w3-opacity">
        <th class="w3-border-bottom w3-hover-shadow">
            {{adn(adn(adn(parentChilds(crId)[0]).r).r).vl_str}}</th>
        <th class="w3-border-bottom w3-border-left w3-hover-shadow">
            {{adn(adn(parentChilds(parentChilds(crId)[0])).r).vl_str}}</th>
    </tr>
    <tr v-for="adnId in parentChilds(crId)" class="w3-hover-shadow">
        <td>{{adn(adnId).vl_str}}</td>
        <td>{{adn(parentChilds(adnId)[0]).vl_str}}</td>
    </tr>
</table>`,
}