import { typesModel } from "@components/boredapi-searchbox/boredapi-searchbox.model.js";
import { htmlResult } from "@components/boredapi-searchresults/templates/boredapi-searchresult.html.js";
import { html } from "@components/boredapi-searchresults/templates/boredapi-searchresults.html.js";
import { Component } from "@components/component.js";
// TODO Add @utils
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
      class RouteGenerator {
        static #API_URL = "http://localhost:9000/api/v0.9.4";
        static #ACTIVITIES = "activities";
        #criteria = {
          one: {
            // TODO Put as disabled other fields when activityId field is focused, same for description.
            byId: () => searchObj.activityId && /^\d{7}$/.test(searchObj.activityId),
          },
          all: {
            passthrough: () => undefined === Object.keys(searchObj).find((k) => k !== "maxResults"),
            byDesc: () => {
              return searchObj.description && /^[a-zA-Z0-9-\s]{1,32}$/.test(searchObj.description);
            },
            byType: () => {
              return (
                searchObj.type && new RegExp(`^(${typesModel.join("|")})$`).test(searchObj.type)
              );
            },
            byParticipants: () => {
              return (
                // TODO On the backend: handle + sign
                searchObj.participants && /^(1|2|3|4|5|8|2\+|3\+|4\+)$/.test(searchObj.participants)
              );
            },
          },
        };
        /** @returns {string} */
        generate() {
          console.log(searchObj);
          switch (true) {
            case this.#criteria.all.passthrough():
              return `${RouteGenerator.#API_URL}/${RouteGenerator.#ACTIVITIES}`;
            case this.#criteria.one.byId():
              return `${RouteGenerator.#API_URL}/${RouteGenerator.#ACTIVITIES}/id/${
                searchObj.activityId
              }`;
            case this.#criteria.all.byDesc():
              return `${RouteGenerator.#API_URL}/${RouteGenerator.#ACTIVITIES}/description/${
                searchObj.description
              }`;
            case this.#criteria.all.byType():
              return `${RouteGenerator.#API_URL}/${RouteGenerator.#ACTIVITIES}/types/${
                searchObj.type
              }`;
            case this.#criteria.all.byParticipants():
              return `${RouteGenerator.#API_URL}/${RouteGenerator.#ACTIVITIES}/participants/${
                searchObj.participants
              }`;
          }
          return null;
        }
      }
      const route = new RouteGenerator().generate();
      return new Promise((resolve, reject) => {
        if (null === route) {
          reject(new Error("Front-end API call not implemented yet"));
          return;
        }
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
        console.error(error);
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
