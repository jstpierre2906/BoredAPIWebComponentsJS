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
 *  activityId?: number,
 *  description?: string,
 *  type?: TypesModel,
 *  participants?: ParticipantsModel,
 *  duration?: DurationModel,
 *  sortOrder? : string,
 *  maxResults: string
 * }} SearchObj
 */

/**
 * @typedef {{
 *  activity: string;
 *  availability: number;
 *  type: string;
 *  participants: number;
 *  price: number;
 *  accessibility: string;
 *  duration: DurationModel;
 *  kidFriendly: boolean;
 *  link: string;
 *  key: number }} Resultset
 */
