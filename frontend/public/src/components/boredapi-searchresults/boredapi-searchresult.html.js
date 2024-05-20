export const htmlResult = ({ activity, key, type, participants, duration, link }) => /*html*/ `
<div class="result">
  <h3>${activity}</h3>
  <ul>
    <li class="id">ID: ${key}</li>
    <li class="type">Type: ${type}</li>
    <li class="participants-duration">
      <span class="participants">Participants: ${participants}</span>
      <span class="duration">Duration: ${duration}</span>
    </li>
    <li class="link">Link: {link}</li>
  </ul>
</div>
`;
