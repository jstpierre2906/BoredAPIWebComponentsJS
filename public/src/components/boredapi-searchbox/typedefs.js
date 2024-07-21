/**
 * @typedef {{
 *  name: "activityId" | "description";
 *  label: "ID" | "Description";
 *  labelSearch: string;
 *  inputElement: HTMLInputElement;
 *  labelElement: HTMLLabelElement
 * }} FieldObj
 */

/**
 * @typedef {{
 *  element: HTMLInputElement;
 *  label: HTMLLabelElement;
 *  fieldObj: FieldObj
 * }} ElementLabelFieldObj
 */

/** @typedef {function(string): HTMLInputElement | HTMLLabelElement} QueryElementLabelFn */

/**@typedef {function(string): ElementLabelFieldObj} FetchOtherElementPartsFn */

/** @typedef {function(string): Object | null} SetSearchFieldsFn */

/** @typedef {function(string, string, string): void} AttributeChangedCallbackFn */

/** @typedef {function(string[], string): boolean} ModelIncludesSearchValueFn */

/** @typedef {function(HTMLOptionElement[], string): void} ManageSelectedAttributeFn */

/**
 * @typedef {function({
 *  iSearchDescription: string,
 *  types: string[],
 *  participants: string[],
 *  durations: string[],
 *  orderbys: string[],
 *  iMaxResults: string | number }): string} HTMLFn
 */

/**
 * @typedef {function({
 *  value: string | number,
 *  selected: boolean,
 *  textContent: string): string} HTMLSelectOptionFn
 */

/**
 * @typedef {(
 *  | "busywork"
 *  | "charity"
 *  | "cooking"
 *  | "diy"
 *  | "education"
 *  | "music"
 *  | "social"
 *  | "recreational"
 *  | "relaxation")[]} TypesModel
 */

/** @typedef {("1" | "2" | "3" | "4" | "5" | "8" | "2+" | "3+" | "4+")[]} ParticipantsModel */

/** @typedef {("minutes" | "hours" | "days" | "weeks")[]} DurationModel */

/**
 * @typedef {{
 *  fields: ("type" | "description" | "duration")[],
 *  values: ("asc" | "desc")[]
 * }} OrderbyModel
 */
