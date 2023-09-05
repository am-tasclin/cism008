'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import {
    mcData, reViewAdn, setActuallyTreeObj, actuallyTreeObj,
    initActuallyTreeOpenedId, treeOpenedChildOnOff,
    domConfHrefHash, reViewActivePanel, getDomComponent,
    setActuallyTreeObjFromPath, setActiveEditObjName,
} from '/f/7/libDomGrid/libDomGrid.js'
import { readAdnByParentIds } from '/f/7/libDbRw/libMcRDb.js'

export default {
    props: { adnId: Number, path: String, treeRootId: Number }, data() { return { count: 0, } },
    mounted() {
        const treeConf = actuallyTreeObj();
        ((treeConf.mcElement || (treeConf.mcElement = {}))[this.treeRootId]
            || (treeConf.mcElement[this.treeRootId] = {}))[this.adnId] = this
    }, methods: {
        adn() { return mcData.eMap[this.adnId] || {} },
        p() { return this.adn() && this.adn().p },
        r1() { return this.adn() && this.adn().r },
        r2() { return this.adn() && this.adn().r2 },
        parentChilds() { return mcData.parentChilds[this.adnId] || [] },
        vlStr() { return this.adn().vl_str && marked.parseInline(this.adn().vl_str) },
        isSelected() { return actuallyTreeObj() && actuallyTreeObj().selectedId == this.adnId },
        isOpened() {
            const x = initActuallyTreeOpenedId(this.treeRootId)
            return x.join(',').includes(this.adnId)
            // return x.includes(this.adnId)
        }, clickAdn() {
            const oldSelectedId = actuallyTreeObj().selectedId;
            (oldSelectedId == this.adnId || !oldSelectedId) &&
                treeOpenedChildOnOff(this.treeRootId, this.adnId)
            !mcData.parentChilds[this.adnId]
                && readAdnByParentIds([this.adnId])
                    .then(() => this.count++) || this.count++
            //setActualeCompomentName('tree')
            setActiveEditObjName('Tree')
            setActuallyTreeObjFromPath(this.path)
            actuallyTreeObj().selectedId = this.adnId
            actuallyTreeObj().selectedRootId = this.treeRootId
            oldSelectedId!=this.adnId && reViewAdn(oldSelectedId)

            getDomComponent('actuallyEdit').count++
            getDomComponent('TreeEp') && getDomComponent('TreeEp').count++
            domConfHrefHash()

        }, click1() {
            const oldSelectedId = actuallyTreeObj().selectedId;
            (oldSelectedId == this.adnId || !oldSelectedId) &&
                treeOpenedChildOnOff(this.treeRootId, this.adnId)
            setActuallyTreeObj(this.path)
            actuallyTreeObj().selectedId = this.adnId
            actuallyTreeObj().selectedRootId = this.treeRootId
            !mcData.parentChilds[this.adnId]
                && readAdnByParentIds([this.adnId])
                    .then(() => this.count++) || this.count++
            oldSelectedId && reViewAdn(oldSelectedId)
            reViewActivePanel(this.adnId, 'Tree')
            domConfHrefHash()
        }
    }, template: `
<div @click="clickAdn" class="w3-hover-shadow" :review="count"
        :class="{'w3-light-grey':isSelected(),'w3-white':!isSelected()}">
    <span class="w3-small" :class="{'w3-text-blue':isSelected()}" > 
        <span v-if="adnId==treeRootId">🗄</span>
        {{adnId}} &nbsp;</span>
    <span v-html="vlStr()" />
    <span class="w3-tiny">&nbsp;
        {{r1()}}, {{r2()}} <span>
</div>
<div class="w3-container w3-border-left" v-if="parentChilds().length && isOpened()">
    <div v-for="adnId2 in parentChilds()">
        <t-mc-element :adnId="adnId2" :path="path" :treeRootId="treeRootId" />
    </div>
</div>
`,
}
