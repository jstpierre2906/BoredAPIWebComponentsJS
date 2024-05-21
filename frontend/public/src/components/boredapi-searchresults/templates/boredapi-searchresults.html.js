export const html = ({ results, emptyResultset }) => /*html*/ `
<link rel="stylesheet" href="/src/components/boredapi-searchresults/styles/boredapi-searchresults.css" />
<div>
  <h2 id="resultsDescription">Search results</h2>
  <div id="results">${results.join("")}</div>
  <div id="empty-resultset">${emptyResultset}</div>
</div>
`;
