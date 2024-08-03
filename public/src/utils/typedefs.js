/**
 * @typedef {{
 *  toSentenceCase: function(string): string,
 *  setDisplay: {
 *      [key in
 *          | "types"
 *          | "participants"
 *          | "durations"
 *          | "sortOrders"]: function(string, string | null): string
 *  },
 * }} UtilsObj
 */
