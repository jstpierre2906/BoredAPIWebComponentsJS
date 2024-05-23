import { BoredAPISearchBox } from "@components/boredapi-searchbox/boredapi-searchbox.js";
import { htmlResult } from "@components/boredapi-searchresults/templates/boredapi-searchresult.html.js";
import { html } from "@components/boredapi-searchresults/templates/boredapi-searchresults.html.js";
import { Component } from "@components/component.js";
import { utils } from "../../utils/utils.js";

export class BoredAPISearchResults extends Component {
  results = [];
  resultsContainer;
  emptyResultset;
  static EMPTY_RESULTSET = "Empty resultset";
  constructor() {
    super();
    this.shadowRoot.appendChild(
      (() => {
        const template = document.createElement("template");
        template.innerHTML = html({
          results: this.results,
          emptyResultset: BoredAPISearchResults.EMPTY_RESULTSET,
        });
        return template.content.cloneNode(true);
      })()
    );
  }

  connectedCallback() {
    this.resultsContainer = this.shadowRoot.querySelector("#results");
    this.emptyResultset = this.shadowRoot.querySelector("#empty-resultset");
    this.addListeners({ events: ["newSearchQueryEvent"] });
  }

  newSearchQueryHandler({ searchQuery }) {
    this.fetchResults(searchQuery)
      .then((results) => this.setResults(results))
      .catch((error) => this.unsetResults());
  }

  fetchResults(searchQuery) {
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

            // TODO Sort to be done Java-side
            filteredData.splice(+searchQuery.maxResults);
            resolve(filteredData);
          })
          .catch((err) => reject(`Error: Problem with JSON formatting - ${err}`));
      }, 100);
    });
  }

  unsetResults() {
    this.results = [];
    this.resultsContainer.innerHTML = null;
    this.emptyResultset.textContent = BoredAPISearchResults.EMPTY_RESULTSET;
  }

  setResults(results) {
    if (results.length === 0) {
      this.unsetResults();
      return;
    }
    this.results = results;
    console.log(this.results);
    this.emptyResultset.textContent = null;
    this.resultsContainer.innerHTML = results
      .map((result) =>
        htmlResult({
          activity: result.activity,
          key: result.key,
          type: utils.setDisplay.types(result.type),
          typeRaw: result.type,
          participants: result.participants,
          duration: utils.setDisplay.durations(result.duration),
          durationRaw: result.duration,
          link: result.link ?? "",
        })
      )
      .join("");

    const maxResults = this.findComponent({ selector: "boredapi-searchbox" }).getAttribute(
      "max-results"
    );
    const spanLinks = this.shadowRoot.querySelectorAll("div.result > ul > li > span.link");
    Array.from(spanLinks).forEach((link) => {
      link.addEventListener("click", () => {
        this.newSearchQueryHandler({
          searchQuery: Object.assign({}, link.dataset, { maxResults: maxResults }),
        });
      });
    });
  }
}
