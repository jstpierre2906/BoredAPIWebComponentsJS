/** @typedef {function({[key: string]: () => void}): void} ApplyActionsFn */

/** @typedef {function({selector: string}): Component} FindComponentFn */

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
