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

/** @typedef {function(string): ElementLabelFieldObj} FetchOtherElementPartsFn */

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
