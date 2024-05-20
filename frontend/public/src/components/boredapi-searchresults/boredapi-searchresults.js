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
            const filteredData = data.filter((d) =>
              searchQuery.activityId ? searchQuery.activityId.toString() === d.key : true
            );
            resolve(filteredData);
          })
          .catch((err) => reject(`Error: Problem with JSON formatting - ${err}`));
      }, 100);
    });
  }
}
