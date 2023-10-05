'use strict'
/**
 * Algoritmed ©, EUPL-1.2 or later.
 * PL — Personal HealthCare Institution 
 * 
 */
const pageData = { kved: { section: {}, conf: {} } }
    , appContainer = {}
console.log('dia_kved', pageData)

fetch('/f/8/tmp/kved2.json').then(response => response.text()).then(data => {
    const dia_kved = JSON.parse(data)
    const clean_dia_kved = dia_kved.filter((d, i) => i > 1)
    clean_dia_kved.forEach(o => {
        const section = Object.entries(o)
            , sk = section[0][1], pk = section[1][1]
            , gk = section[2][1], ck = section[3][1]
            , name = section[4][1]
        !pageData.kved.section[sk] && (pageData.kved.section[sk]
            = { name: name });
        !pageData.kved.section[sk].part && (pageData.kved.section[sk].part = {})
        !pageData.kved.section[sk].part[pk] && (pageData.kved.section[sk].part[pk]
            = { name: name })
        !pageData.kved.section[sk].part[pk].group && (pageData.kved.section[sk].part[pk].group = {})
        !pageData.kved.section[sk].part[pk].group[gk] &&
            (pageData.kved.section[sk].part[pk].group[gk]
                = { name: name })
        !pageData.kved.section[sk].part[pk].group[gk].class
            && (pageData.kved.section[sk].part[pk].group[gk].class = {})
        !pageData.kved.section[sk].part[pk].group[gk].class[ck] &&
            (pageData.kved.section[sk].part[pk].group[gk].class[ck]
                = { name: name })

    })
    appKved.methods.sectionList().filter(sk => !sk && delete pageData.kved.section[sk])
    appKved.methods.sectionList().forEach(sk => appKved.methods.partList(sk).filter(pk => !pk &&
        delete pageData.kved.section[sk].part[pk]))
    appKved.methods.sectionList().forEach(sk => appKved.methods.partList(sk
    ).forEach(pk => appKved.methods.groupList(sk, pk).filter(gk => !gk &&
        delete pageData.kved.section[sk].part[pk].group[gk])))
    appKved.methods.sectionList().forEach(sk => appKved.methods.partList(sk).forEach(pk => appKved.methods.groupList(sk, pk
    ).forEach(gk => appKved.methods.classList(sk, pk, gk).filter(ck => !ck &&
        delete pageData.kved.section[sk].part[pk].group[gk].class[ck]))))
    appContainer.kved.count++

    console.log(pageData.kved)
})

const { createApp } = Vue
const appKved = {
    data() { return { count: 0 } },
    mounted() { appContainer.kved = this },
    methods: {
        isClosedSk: sk => pageData.kved.conf.closeSk && pageData.kved.conf.closeSk.includes(sk),
        closeSk: sk => {
            const closeSk = pageData.kved.conf.closeSk
                || (pageData.kved.conf.closeSk = [])
            closeSk.includes(sk) && closeSk.splice(closeSk.indexOf(sk), 1) || closeSk.push(sk)
            appContainer.kved.count++

        },
        sectionList: () => Object.keys(pageData.kved.section),
        section: sk => pageData.kved.section[sk],
        partList: sk => Object.keys(pageData.kved.section[sk].part),
        groupList: (sk, pk) =>
            Object.keys(pageData.kved.section[sk].part[pk].group),
        classList: (sk, pk, gk) =>
            Object.keys(pageData.kved.section[sk].part[pk].group[gk].class),
    },
}
createApp(appKved).mount('#kved')

