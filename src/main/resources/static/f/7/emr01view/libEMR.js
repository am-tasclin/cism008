'use strict'
/**
 * Algoritmed ©, Licence EUPL-1.2 or later.
 * 
 */
import { adn, domConstants } from '/f/7/libDomGrid/libDomGrid.js'
export const emrSymbolR = { emrSymbolR: adnId => emrType[adn(adnId).r] }
/**
 * 
 */
domConstants.PatientIdList = [2009]
/**
 * ⌓℅ -- EpisodeOfCare (Segment Care of)
 * ⌔℅ -- Encounter (Sector Care of)
 */
const emrType = {
    2008: '⌔℅'   // Encounter.basedOn
    , 2009: '⌓℅' // EpisodeOfCare.patient
    , 2010: '🕘' // EpisodeOfCare.period
    , 2011: '🕘' // Encounter.actualPeriod
    , 2012: '🕛' // Period.end
}
