import "../boredapi-searchresults.typedefs.js";

/** @type {HTMLLinkFn} */
const htmlLink = ({ link }) => /*html*/ `
  <ul>
    <li class="left">
      <span class="label">Link:</span>
      <a href="${link}" target="_blank">${link}</a>
    </li>
  </ul>
`;

/** @type {HTMLResultFn} */
export const htmlResult = ({
  activity,
  key,
  type,
  typeRaw,
  participants,
  duration,
  durationRaw,
  link,
}) => /*html*/ `
<div class="result">
  <dl><dt>${activity}</dt></dl>
  <ul>
    <li class="left">
      <span class="label">ID: </span>
      ${key}
    </li>
    <li class="right">
      <span class="label">Type: </span>
      <span class="link" data-type="${typeRaw}">${type}</span>
    </li>
  </ul>
  <ul>
    <li class="left">
      <span class="label">Participants: </span>
      <span class="link" data-participants="${participants}">${participants}</span>
    </li>
    <li class="right">
      <span class="label">Duration: </span>
      <span class="link" data-duration="${durationRaw}">${duration}</span>
    </li>
  </ul>
  ${link && htmlLink({ link: link })}
</div>
`;
