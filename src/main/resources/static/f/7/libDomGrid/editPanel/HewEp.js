'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import {
    getActualeCompomentName, consoleLogDomContainer,
} from '/f/7/libDomGrid/libDomGrid.js'
export default {
    methods: {
        actuallyCompomentName() {
            consoleLogDomContainer()
            return getActualeCompomentName()
        },
    }, template: `
<div>
    a1:Hew
    {{actuallyCompomentName()}}
</div>
`,
}
