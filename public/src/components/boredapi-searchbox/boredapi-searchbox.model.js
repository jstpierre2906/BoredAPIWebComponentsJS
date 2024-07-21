import "./typedefs.js";

/** @type {TypesModel} */
export const typesModel = [
  "busywork",
  "charity",
  "cooking",
  "diy",
  "education",
  "music",
  "social",
  "recreational",
  "relaxation",
];

/** @type {ParticipantsModel} */
export const participantsModel = ["1", "2", "3", "4", "5", "8", "2+", "3+", "4+"];

/** @type {DurationModel} */
export const durationsModel = ["minutes", "hours", "days", "weeks"];

/** @type {OrderbyModel} */
export const orderbyModel = {
  fields: ["type", "description", "duration"],
  values: ["asc", "desc"],
};
