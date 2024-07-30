/**
 * @typedef {{
 *  toSentenceCase: function(string): string,
 *  setDisplay: {
 *      [key in
 *          | "types"
 *          | "participants"
 *          | "durations"
 *          | "orderbys"]: function(string, string | null): string
 *  },
 * }} UtilsObj
 */
