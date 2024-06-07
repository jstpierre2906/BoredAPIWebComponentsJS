export const utils = {
  /**
   * @param {string} str
   * @returns {string}
   */
  toSentenceCase: (str) => str.substring(0, 1).toUpperCase() + str.substring(1),
  setDisplay: {
    /** param and return types are same as toSentenceCase */
    types: (type) => (type === "diy" ? type.toUpperCase() : utils.toSentenceCase(type)),
    /** param and return types are same as toSentenceCase */
    participants: (qty) => qty.replace("+", " or more"),
    /** param and return types are same as toSentenceCase */
    durations: (duration) => utils.toSentenceCase(duration),
    /** param and return types are same as toSentenceCase */
    orderbys: (field, value) => `${utils.toSentenceCase(field)} - ${value.toUpperCase()}`,
  },
};
