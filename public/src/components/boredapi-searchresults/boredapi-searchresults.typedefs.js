/**
 * @typedef {function(): {
 *  [key in
 *      | "duration"
 *      | "participants"
 *      | "type"]: string }} SearchBoxSearchFieldAttributeFn
 */

/** @typedef {"base" | "id" | "description" | "types" | "participants" | "duration"} URIPart */

/** @typedef {{byId: function(): boolean}} RouteGeneratorCriteriaOne */

/**
 * @typedef {{
 *  [key in
 *      | "all"
 *      | "byDescription"
 *      | "byType"
 *      | "byParticipants"
 *      | "byDuration"]: function(): boolean
 * }} RouteGeneratorCriteriaAll
 */

/** @typedef {{ findOne: RouteGeneratorCriteriaOne; findAll: RouteGeneratorCriteriaAll; }} RouteGeneratorCriteria */

/** @typedef {function({link: string}): string} HTMLLinkFn */

/**
 * @typedef {function({
 *  activity: string,
 *  key: string,
 *  type: string,
 *  typeRaw: string,
 *  participants: string,
 *  duration: string,
 *  durationRaw: string,
 *  link: string
 *  }): string} HTMLResultFn
 */

/** @typedef {function({results: string, emptyResultset: string }): string} SearchresultsHTMLFn */
