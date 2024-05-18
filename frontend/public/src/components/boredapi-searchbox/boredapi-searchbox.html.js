export const html = ({
  textContent,
  types,
  participants,
  durations,
  orderbys,
  iMaxResults,
}) => /*html*/ `
<link rel="stylesheet" href="/src/components/boredapi-searchbox/boredapi-searchbox.css" />
<div>
  <h2>${textContent}</h2>
  <form>
    <div>
      <label for="activityId">ID</label>
      <input type="number" id="activityId" maxlength="7" placeholder="0000000" />
    </div>
    <div>
      <label for="description">Description</label>
      <input type="text" id="description" placeholder="Some description" />
    </div>
    <div>
      <label for="type">Type</label>
      <select id="type">${types.join("")}</select>
    </div>
    <div>
      <label for="participants">Participants</label>
      <select id="participants">${participants.join("")}</select>
    </div>
    <div>
      <label for="duration">Duration</label>
      <select id="duration">${durations.join("")}</select>
    </div>
    <div>
      <label for="orderby">Order by</label>
      <select id="orderby">${orderbys.join("")}</select>
    </div>
    <div>
      <input id="maxResults" type="hidden" value="${iMaxResults}" />
      <input id="resetBtn" type="reset" value="Reset" />
      <input id="searchBtn" type="button" value="Search" />
    </div>
  </form>
</div>
`;
