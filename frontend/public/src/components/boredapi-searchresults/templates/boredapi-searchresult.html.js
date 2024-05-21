const htmlLink = ({ link }) => /*html*/ `
  <ul class="thirdRow"><li class="link">Link: <a href="${link}" target="_blank">${link}</a></li></ul>
`;

export const htmlResult = ({ activity, key, type, participants, duration, link }) => /*html*/ `
<div class="result">
  <h3>${activity}</h3>
  <div>
    <ul class="firstRow">
      <li class="id">ID: ${key}</li>
      <li class="type">Type: ${type}</li>
    </ul>
    <ul class="secondRow">
      <li class="participants">Participants: ${participants}</li>
      <li class="duration">Duration: ${duration}</li>
    </ul>
    ${link && htmlLink({ link: link })}
  </div>
</div>
`;
