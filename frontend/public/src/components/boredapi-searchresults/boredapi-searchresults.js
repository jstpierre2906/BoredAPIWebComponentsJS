import { html } from "@components/boredapi-searchresults/boredapi-searchresults.html.js";
import { Component } from "@components/component.js";

export class BoredAPISearchResults extends Component {
  static DEFAULT_SEARCH_DESCRIPTION = "Search Bored API";
  results;
  constructor() {
    super();
    this.shadowRoot.appendChild(
      (() => {
        const template = document.createElement("template");
        template.innerHTML = html({ results: this.results });
        return template.content.cloneNode(true);
      })()
    );
  }

  connectedCallback() {
    this.addListeners({ events: ["newSearchQueryEvent"] });
  }

  newSearchQueryHandler({ searchQuery }) {
    this.setResults(searchQuery)
      .then((results) => console.log(results))
      .catch((error) => console.log(error));
  }

  setResults(searchQuery) {
    const queryString = Object.keys(searchQuery)
      .filter((key) => searchQuery[key] !== "")
      .map((key) => `${key}=${searchQuery[key]}`)
      .join("&");
    return new Promise((resolve, reject) => {
      // Mock, remove settimeout after.
      setTimeout(() => {
        fetch(`/mock-data/activities.json?${queryString}`, {
          method: "GET",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => {
            if (response.status !== 200) {
              reject(`Error: Response status ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            const filteredData = data
              .filter((d) =>
                searchQuery.activityId ? d.key.includes(searchQuery.activityId.toString()) : true
              )
              .filter((d) =>
                searchQuery.description
                  ? d.activity.toLowerCase().includes(searchQuery.description.toLowerCase())
                  : true
              )
              .filter((d) => (searchQuery.type ? d.type === searchQuery.type : true))
              .filter((d) => {
                if (!searchQuery.participants) {
                  return true;
                }
                if (searchQuery.participants.endsWith("+")) {
                  const participants = +searchQuery.participants.replace("+", "");
                  return d.participants >= participants;
                }
                return d.participants === +searchQuery.participants;
              })
              .filter((d) => (searchQuery.duration ? d.duration === searchQuery.duration : true));

            filteredData.splice(+searchQuery.maxResults);
            resolve(filteredData);
          })
          .catch((err) => reject(`Error: Problem with JSON formatting - ${err}`));
      }, 100);
    });
  }
}
