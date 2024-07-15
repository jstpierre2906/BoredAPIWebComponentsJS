import { htmlResult } from "@components/boredapi-searchresults/templates/boredapi-searchresult.html.js";
import { html } from "@components/boredapi-searchresults/templates/boredapi-searchresults.html.js";
import { Component } from "@components/component.js";
import { utils } from "../../utils/utils.js";

export class BoredAPISearchResults extends Component {
  static #EMPTY_RESULTSET = "Empty resultset";

  #resultsContainer;
  #emptyResultset;

  constructor() {
    super();
    this.shadowRoot.appendChild(
      (() => {
        const template = document.createElement("template");
        template.innerHTML = html({
          results: [],
          emptyResultset: BoredAPISearchResults.#EMPTY_RESULTSET,
        });
        return template.content.cloneNode(true);
      })()
    );
  }

  connectedCallback() {
    this.#resultsContainer = this.shadowRoot.querySelector("#results");
    this.#emptyResultset = this.shadowRoot.querySelector("#empty-resultset");
    this.addEventListener("searchEvent", (event) => this.#searchHandler(event.detail));
  }

  /** @param {{ searchObj: Object }} */
  #searchHandler({ searchObj }) {
    /** @returns {Promise<Object | Object[]>} */
    (() => {
      const apiURL = "http://localhost:9000/api/v0.9.4";
      let route = "";
      console.log(searchObj);
      const findAll = () =>
        Object.keys(searchObj)
          .filter((k) => k !== "maxResults")
          .every((k) => searchObj[k] === "");
      const findOneById = () => /^\d+$/.test(searchObj.activityId);
      switch (true) {
        case findAll():
          route = `${apiURL}/activities`;
          break;
        case findOneById():
          route = `${apiURL}/activities/id/${searchObj.activityId}`;
          break;
        default:
          return Promise.reject(new Error("Front-end API call not implemented yet"));
      }
      return new Promise((resolve, reject) => {
        fetch(route, { method: "GET" })
          .then((response) => {
            if (response.status !== 200) {
              reject(new Error(`Error: Response status ${response.status}`));
            }
            return response.json();
          })
          .then((resultset) => resolve(resultset))
          .catch((error) => reject(error));
      });
    })()
      .then((resultset) => this.#setResults(resultset))
      .catch((error) => {
        console.log(error);
        this.#unsetResults();
      });
  }

  #unsetResults() {
    this.#resultsContainer.innerHTML = null;
    this.#emptyResultset.textContent = BoredAPISearchResults.#EMPTY_RESULTSET;
  }

  /** @param {Object | Object[]} resultset */
  #setResults(resultset) {
    if (resultset.length === 0) {
      this.#unsetResults();
      return;
    }
    this.#emptyResultset.textContent = null;
    (() => {
      const setValues = (resultsetObj) => ({
        activity: resultsetObj.activity,
        key: resultsetObj.key,
        type: utils.setDisplay.types(resultsetObj.type),
        typeRaw: resultsetObj.type,
        participants: resultsetObj.participants,
        duration: utils.setDisplay.durations(resultsetObj.duration),
        durationRaw: resultsetObj.duration,
        link: resultsetObj.link ?? "",
      });
      if (Array.isArray(resultset)) {
        this.#resultsContainer.innerHTML = resultset
          .map((resultsetObj) => htmlResult(setValues(resultsetObj)))
          .join("");
        return;
      }
      this.#resultsContainer.innerHTML = htmlResult(setValues(resultset));
    })();

    const headerContainer = document.querySelector("#header-container");
    const searchBox = this.findComponent({ selector: "boredapi-searchbox" });
    const maxResults = searchBox.getAttribute("max-results");
    const spanLinks = this.shadowRoot.querySelectorAll("div.result > ul > li > span.link");
    Array.from(spanLinks).forEach((link) => {
      /** @returns {Single-key JSON as string} */
      const searchBoxSearchFieldAttribute = () => {
        return Object.keys(link.dataset)
          .map((key) => `{'${key}': '${link.dataset[key]}'}`)
          .reduce((_acc, curr) => (_acc += curr), "");
      };
      link.addEventListener("click", () => {
        this.#searchHandler({
          searchObj: Object.assign({}, link.dataset, { maxResults: maxResults }),
        });
        searchBox.setAttribute("search-fields", searchBoxSearchFieldAttribute());
        headerContainer.scrollIntoView({ behavior: "smooth" });
      });
    });
  }
}
