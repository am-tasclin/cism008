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
domConstants.EpisodeOfCareIds = [2009]
domConstants.EncounterIds = [2008]
domConstants.CarePlanIds = [2015]
domConstants.DocumentReferenceIds = [2016]
/**
 * ⌓℅ -- EpisodeOfCare (Segment, Care of)
 * ⌔℅ -- Encounter (Sector, Care of)
 * ⛒℅ -- CarePlan (Circled Crossing Lanes, Care of)
 */
const emrType = {
    2009: '⌓℅', // EpisodeOfCare.patient
    2008: '⌔℅ꭍ', // Encounter.basedOn
    2015: '⛒℅', // CarePlan.title
    2013: '💼.⛋', // CarePlan.instantiatesCanonical PlanDefinition
    2016: '🔗', // Attachment.url
    2010: '🕘', // EpisodeOfCare.period Period.start
    2011: '🕘', // Encounter.actualPeriod Period.start
    2012: '🕛', // Period.end
}
