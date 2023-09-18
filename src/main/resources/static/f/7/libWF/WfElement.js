'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { mcDataMethods, domConfWf, setDomComponent } from '/f/7/libDomGrid/libDomGrid.js'
/**
 * 
 */
const Task = {
    props: { adnId: Number }, data() { return { count: 0, } },
    mounted() { domConfWf().taskComponent[this.adnId] = this }, methods: Object.assign({}, {
        taskSymbolR: adnId => taskType[mcDataMethods.adn(adnId).r],
        taskIOCmd: adnId => taskIOCmd(adnId),
    }, mcDataMethods), template: `
{{adn(adnId).vl_str}}
<div v-if="parentChilds(adnId).length" class="w3-container w3-border-left">
    <div v-for="adnId2 in parentChilds(adnId)">
        <span class="w3-tiny">{{adnId2}}&nbsp;</span>{{taskSymbolR(adnId2)}}
        <span class="w3-opacity w3-small">{{adn(taskIOCmd(adnId2)).vl_str}}</span>
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
const taskType = { 371934: '⇥', 371936: '↦', }
import { childTaskId, wfType, wfSymbolPR, wfSymbolR2, taskIOCmd } from
    '/f/7/libWF/libWF.js'
/**
 * WfElement
 */
export const WfElement = {
    props: { adnid: Number }, data() { return { count: 0, } }, components: { Task, },
    mounted() { domConfWf().wfComponent[this.adnid] = this }, methods: Object.assign({}, {
        wfSymbolR: adnId => wfType[mcDataMethods.adn(adnId).r],
    }, mcDataMethods, wfSymbolR2, wfSymbolPR, childTaskId), template: `
<div v-if="parentChilds(adnid).length" class="w3-container w3-border-left">
    <template v-for="adnId2 in parentChilds(adnid)">
        <div class="w3-row" v-if="childTaskId(adnId2)">
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
                    {{wfSymbolPR(adnId2)}}{{wfSymbolR(adnId2)}}{{wfSymbolR2(adnId2)}}
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
export const CodeMetaData = {
    props: { cmd: Array }, data() { return { count: 0, } },
    mounted() { setDomComponent('cmd', this) }, methods: mcDataMethods, template: `
<div :review="count" v-for="cmdId in cmd" class="w3-hover-shadow">
    <span class="w3-tiny">{{cmdId}}</span>
    {{adn(cmdId).vl_str}}
    <div v-if="parentChilds(cmdId)" class="w3-container w3-border-left">
        <div v-for="adnId in parentChilds(cmdId)" class="w3-hover-shadow">
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
    mounted() { setDomComponent('ccr', this) }, methods: mcDataMethods, template: `
<table :review="count" v-for="crId in cr" class="w3-small am-width-100pr" >
    <caption class="w3-light-grey">{{crId}} {{adn(crId).vl_str}}</caption>
    <tr class="w3-tiny w3-opacity">
        <th class="w3-border-bottom w3-hover-shadow">
            {{adn(adn(adn(parentChilds(crId)[0]).r).r).vl_str}}
        </th>
        <th class="w3-border-bottom w3-border-left w3-hover-shadow">
            {{adn(adn(parentChilds(parentChilds(crId)[0])).r).vl_str}}</th>
    </tr>
    <tr v-for="adnId in parentChilds(crId)" class="w3-hover-shadow">
        <td><span class="w3-tiny w3-right">{{adn(adnId).doc_id}}</span>
            {{adn(adnId).vl_str}}
        </td>
        <td><span class="w3-tiny w3-right">{{adn(parentChilds(adnId)[0]).doc_id}}</span>
            {{adn(parentChilds(adnId)[0]).vl_str}}
        </td>
    </tr>
</table>`,
}
