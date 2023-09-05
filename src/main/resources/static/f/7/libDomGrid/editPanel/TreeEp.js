'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import {
    mcData, setDomComponent, getActualeCompomentName, actuallyTreeObj,
    getDomComponent,
} from '/f/7/libDomGrid/libDomGrid.js'
import { dbSendInsertAdn, dbSendDeleteAdn1 } from
    '/f/7/libDbRw/libMcRDb.js'

const treeSelectedId = () => actuallyTreeObj() && actuallyTreeObj().selectedId
    , adn = () => mcData.eMap[treeSelectedId()]
    , reViewEditPanel = () => {
        getDomComponent('TreeEp').count++
    }

const isAdnEditPanelSubMenu = type => actuallyTreeObj() && actuallyTreeObj().adnEditPanelSubMenu
    && actuallyTreeObj().adnEditPanelSubMenu[treeSelectedId()]
    && actuallyTreeObj().adnEditPanelSubMenu.activeId == treeSelectedId()
    && actuallyTreeObj().adnEditPanelSubMenu[treeSelectedId()].type == type
    , initAdnEditPanelSubMenu = () => {
        !actuallyTreeObj().adnEditPanelSubMenu && (actuallyTreeObj().adnEditPanelSubMenu = { activeId: treeSelectedId() })
            || (actuallyTreeObj().adnEditPanelSubMenu.activeId = treeSelectedId())
        !actuallyTreeObj().adnEditPanelSubMenu[treeSelectedId()] &&
            (actuallyTreeObj().adnEditPanelSubMenu[treeSelectedId()] = { edVlStr: adn().vl_str })
        return actuallyTreeObj().adnEditPanelSubMenu[treeSelectedId()]
    }
    , adnEditPanelSubMenuOnOff = type => !isAdnEditPanelSubMenu(type)
        && (initAdnEditPanelSubMenu().type = type)
        || delete actuallyTreeObj().adnEditPanelSubMenu[treeSelectedId()].type

export default {
    data() { return { count: 0, } },
    mounted() { setDomComponent('TreeEp', this) }, methods: {
        adn() { return adn() },
        p() { return adn() && adn().p },
        r1() { return adn() && adn().r },
        r2() { return adn() && adn().r2 },
        actuallyCompomentName() { return getActualeCompomentName() },
        insertAdnChild() { dbSendInsertAdn({ parent: adn().doc_id }) },
        insertAdnSibling() { dbSendInsertAdn({ parent: adn().p }) },
        deleteAdn() { dbSendDeleteAdn1({ adnId: this.adn().doc_id, p: this.adn().p }) },
        copyId() { return actuallyTreeObj().copyId },
        copyAdnId() {
            actuallyTreeObj().copyId = this.adn().doc_id
            reViewEditPanel()
        },
        treeSelectedId() { return treeSelectedId() },
        selectedRootId() { return actuallyTreeObj().selectedRootId },
        isEditStrMenu() { return isAdnEditPanelSubMenu('editStr') },
        isSortMenu() { return isAdnEditPanelSubMenu('sort') },
        setEdVlStr(vl) { initAdnEditPanelSubMenu().edVlStr = vl },
        adnEditPanelSubMenu() { return actuallyTreeObj().adnEditPanelSubMenu[treeSelectedId()] },
        editStrMenu() {
            console.log(actuallyTreeObj())
            console.log(actuallyTreeObj().adnEditPanelSubMenu)
            adnEditPanelSubMenuOnOff('editStr')
            // this.count++
            reViewEditPanel()

        },
    }, template: `
<div class="w3-row" v-if="true||'tree'==actuallyCompomentName()">
    <span class="w3-right w3-tiny w3-opacity">
        <span v-if="copyId()">copyId:{{copyId()}} ‧ </span>
        <span class="w3-text-blue am-b"> {{treeSelectedId()}}</span> ‧ tree</span>
    <div class="w3-col" style="width: 6em;">
        <span class="w3-tiny ">
            <span class="w3-opacity w3-right w3-text-blue"> {{treeSelectedId()}} &nbsp;</span>
            <span class="am-b"> Adn edit panel: </span>
        </span>
    </div>
    <div class="w3-rest">
        <button @click="insertAdnChild" class="w3-border-left w3-btn am-b" title="addChild - додати дитину">˙＋</button>
        <button @click="insertAdnSibling" class="w3-btn am-b" title="addSibling - додати побратима">＋</button>
        <button @click="deleteAdn" class="w3-btn am-b" >－</button>
        <button @click="copyAdnId" class="w3-border-left w3-btn am-b" title="copy - копіювати">⧉</button>
        <button @click="pasteAdnSibling" class="w3-btn am-b" title="paste sibling - вставити як побратима">⧠</button>

        <button @click="upOneLevel" v-if="treeSelectedId()==selectedRootId()" class="w3-btn am-b w3-border-left" title="up one level - на один рівень вище" >🡖</button>
        <button @click="takeToRoot" v-if="treeSelectedId()!=selectedRootId()"
            :class="{'w3-disabled':p()!=selectedRootId()}"
            class="w3-btn am-b w3-border-left" title="take to root - вкоренити" >🡔</button>
        
        <button @click="editStrMenu" :class="{'w3-light-grey':isEditStrMenu()}"
            class="w3-btn am-b w3-border-left w3-topbar" title="edit string value">✎</button>
        <button @click="sortMenu" :class="{'w3-light-grey':isSortMenu()}"
            class="w3-btn am-b w3-border-left w3-topbar" title="sort sibling">⇅</button>
            &nbsp;
        <span class="w3-border-left">&nbsp; 𝑟¹
            <span @click="delR1" class="w3-hover-shadow" v-if="r1()">-</span>
            <button @click="copyR" class="w3-btn " title="copy R1">⧉</button>
            <button @click="setR" class="w3-btn " title="set R1">⧠</button>
            <span class="w3-tiny am-i">{{r1()}}:</span>
        </span>&nbsp;
        <span class="w3-border-left w3-border-right">&nbsp; 𝑟²
            <span @click="delR2" class="w3-hover-shadow" v-if="r2()">-</span>
            <button @click="copyR2" class="w3-btn " title="copy R2">⧉</button>
            <button @click="setR2" class="w3-btn " title="set R2">⧠</button>
            <span class="w3-tiny">{{r2()}}:</span>
            &nbsp;
        </span>

    </div>
    <div v-if="isEditStrMenu()" class="w3-row">
        <div class="w3-col" style="width: 80%;">
            <textarea class="am-width-100pr w3-border" 
                :value="adnEditPanelSubMenu().edVlStr"
                @input="setEdVlStr($event.target.value)" />
        </div>
        <div class="w3-rest">
            <button @click="sendVlStrDb" class="w3-border w3-small">⛃  sendDb - відправити БД</button>
        </div>
    </div>
    <template v-else-if="isSortMenu()">
        <span class="w3-large w3-topbar">&nbsp;⇅&nbsp;</span>
        <button @click="sortUp" class="w3-btn" titlw="up">⬆</button>
        <button @click="sortDown" class="w3-btn" title="down">⬇</button>
        <button @click="sortFirst" class="w3-btn w3-border-left" title="toFirst">⮸</button>
        <button @click="sortEnd" class="w3-btn" style="transform: rotate(180deg);"
            title="toLast">⮸</button>
    </template>
    <div v-else class="w3-row">
        <div class="w3-half">𝑟¹
            <span class="w3-tiny">{{r1()}}</span>:
        </div>
        <div class="w3-half">𝑟²
            <span class="w3-tiny">{{r2()}}</span>:
        </div>
    </div>
</div> <span class="w3-hide">{{count}}</span>
`,
}
