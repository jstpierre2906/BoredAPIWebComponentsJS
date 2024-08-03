import "./typedefs.js";

/** @type {UtilsObj} */
export const utils = {
  toSentenceCase: (str) => str.substring(0, 1).toUpperCase() + str.substring(1),
  setDisplay: {
    types: (type) => (type === "diy" ? type.toUpperCase() : utils.toSentenceCase(type)),
    participants: (qty) => qty.replace("+", " or more"),
    durations: (duration) => utils.toSentenceCase(duration),
    sortOrders: (field, value) => `${utils.toSentenceCase(field)} - ${value.toUpperCase()}`,
  },
};
