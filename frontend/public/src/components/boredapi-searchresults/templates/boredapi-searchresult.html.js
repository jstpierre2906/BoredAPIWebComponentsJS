const htmlLink = ({ link }) => /*html*/ `
  <ul class="thirdRow">
    <li class="left">
      <span class="label">Link:</span>
      <a href="${link}" target="_blank">${link}</a>
    </li>
  </ul>
`;

export const htmlResult = ({ activity, key, type, participants, duration, link }) => /*html*/ `
<div class="result">
  <h3>${activity}</h3>
  <ul class="firstRow">
    <li class="left"><span class="label">ID: </span>${key}</li>
    <li class="right"><span class="label">Type: </span>${type}</li>
  </ul>
  <ul class="secondRow">
    <li class="left"><span class="label">Participants: </span>${participants}</li>
    <li class="right"><span class="label">Duration: </span>${duration}</li>
  </ul>
  ${link && htmlLink({ link: link })}
</div>
`;
