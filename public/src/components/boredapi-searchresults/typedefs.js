/**
 * @typedef {function(): {[key in "duration" | "participants" | "type"]: string }} SearchBoxSearchFieldAttributeFn
 */

/** @typedef {"minutes" | "hours" | "days" | "weeks"} Duration */

/**
 * @typedef {{
 *  activity: string;
 *  availability: number;
 *  type: string;
 *  participants: number;
 *  price: number;
 *  accessibility: string;
 *  duration: Duration;
 *  kidFriendly: boolean;
 *  link: string;
 * key: number }} Resultset
 */

/** @typedef {"base" | "id" | "description" | "types" | "participants" | "duration"} URIPart */

/**
 * @typedef {
*  | "busywork"
*  | "charity"
*  | "cooking"
*  | "diy"
*  | "education"
*  | "music"
*  | "social"
*  | "recreational"
*  | "relaxation"} TypesModel
*/

/** @typedef {"1" | "2" | "3" | "4" | "5" | "8" | "2+" | "3+" | "4+"} ParticipantsModel */

/** @typedef {"minutes" | "hours" | "days" | "weeks"} DurationModel */

/**
* @typedef {{
*  fields: ("type" | "description" | "duration")[],
*  values: ("asc" | "desc")[]
* }} OrderbyModel
*/

/**
 * @typedef {{
 *  type?: TypesModel,
 *  participants?: ParticipantsModel,
 *  duration?: DurationModel,
 *  maxResults: string
 * }} SearchObj
 */

/** @typedef {{byId: function(): boolean}} RouteGeneratorCriteriaOne */

/**
 * @typedef {{
 *  [key:
 *      | "all"
 *      | "byDescription"
 *      | "byType"
 *      | "byParticipants"
 *      | "byDuration"]: function(): boolean
 * }} RouteGeneratorCriteriaAll
 */

/** @typedef {{ findOne: RouteGeneratorCriteriaOne; findAll: RouteGeneratorCriteriaAll; }} RouteGeneratorCriteria */
