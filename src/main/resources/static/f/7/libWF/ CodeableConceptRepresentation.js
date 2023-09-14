'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { mcData, setDomComponent } from '/f/7/libDomGrid/libDomGrid.js'
export default {
    props: { cr: Object }, data() { return { count: 0, } },
    mounted() {
        setDomComponent('ccr', this)
        console.log(123, mcData.eMap)
    }, methods: {
        adn(adnId) { return mcData.eMap[adnId] || {} },
        parentChilds(adnId) { return mcData.parentChilds[adnId] || [] },
    }, template: `
<table :review="count" v-for="crId in cr" class="w3-small am-width-100pr" >
    <caption class="w3-light-grey">{{crId}} {{adn(crId).vl_str}}</caption>
    <tr v-for="adnId in parentChilds(crId)" class="w3-hover-shadow">
        <td>{{adn(adnId).vl_str}}</td>
        <td>{{adn(parentChilds(adnId)[0]).vl_str}}</td>
    </tr>
</table>
`,
}