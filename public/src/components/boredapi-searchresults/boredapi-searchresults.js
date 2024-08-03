import { typesModel } from "@components/boredapi-searchbox/boredapi-searchbox.model.js";
import { htmlResult } from "@components/boredapi-searchresults/templates/boredapi-searchresult.html.js";
import { html } from "@components/boredapi-searchresults/templates/boredapi-searchresults.html.js";
import { Component } from "@components/component.js";
import { utils } from "@utils/utils.js";
import "../typedefs.js";
import "./typedefs.js";

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

  /** @param {{ searchObj: SearchObj }} */
  #searchHandler({ searchObj }) {
    /** @returns {Promise<Resultset | Resultset[]>} */
    (() => {
      class RouteGenerator {
        static #API_URL = "http://localhost:9000/api/v0.9.4";
        static #ACTIVITIES = "activities";
        static #BASE_URI = `${RouteGenerator.#API_URL}/${RouteGenerator.#ACTIVITIES}`;

        #route = "";
        /** @type {RouteGeneratorCriteria} */
        #criteria = {
          findOne: {
            byId: () => searchObj.activityId && /^\d{1,7}$/.test(searchObj.activityId),
          },
          findAll: {
            all: () => undefined === Object.keys(searchObj).find((k) => k !== "maxResults"),
            byDescription: () => {
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
            byDuration: () => {
              return searchObj.duration && /^(minutes|hours|days|weeks)$/.test(searchObj.duration);
            },
          },
        };

        /** @param {URIPart} uriPart */
        #buildRoute(uriPart) {
          const uriParts = {
            base: RouteGenerator.#BASE_URI,
            id: `/id/${searchObj.activityId}`,
            description: `/description/${searchObj.description}`,
            types: `/types/${searchObj.type}`,
            participants: `/participants/${searchObj.participants}`,
            duration: `/duration/${searchObj.duration}`,
          };
          this.#route = this.#route.concat(uriParts[uriPart]);
        }

        /** @returns {RouteGenerator} */
        generate() {
          console.log(searchObj);
          switch (true) {
            case this.#criteria.findAll.all():
              this.#buildRoute("base");
              return this;

            case this.#criteria.findOne.byId():
              this.#buildRoute("base");
              this.#buildRoute("id");
              return this;

            case this.#criteria.findAll.byDescription():
              this.#buildRoute("base");
              this.#buildRoute("description");
              return this;

            case this.#criteria.findAll.byType():
              this.#buildRoute("base");
              this.#buildRoute("types");
              if (this.#criteria.findAll.byParticipants()) {
                // TODO Create TYPES_DURATION
                this.#buildRoute("participants");
              }
              if (this.#criteria.findAll.byDuration()) {
                this.#buildRoute("duration");
              }
              return this;

            case this.#criteria.findAll.byParticipants():
              this.#buildRoute("base");
              this.#buildRoute("participants");
              if (this.#criteria.findAll.byDuration()) {
                this.#buildRoute("duration");
              }
              return this;

            case this.#criteria.findAll.byDuration():
              this.#buildRoute("base");
              this.#buildRoute("duration");
          }
          return this;
        }

        addQueryString() {
          if (searchObj.sortOrder) {
            this.#route = this.#route.concat(`?sort-order=${searchObj.sortOrder}`);
          }
        }

        /** @returns {string} */
        getRoute() {
          return this.#route;
        }
      }
      const routeGenerator = new RouteGenerator();
      routeGenerator.generate().addQueryString();
      return new Promise((resolve, reject) => {
        const route = routeGenerator.getRoute();
        if (!route) {
          reject(new Error("No search criteria matched"));
          return;
        }
        fetch(route, { method: "GET" })
          .then((response) => {
            if (response.status !== 200) {
              reject(new Error(`Response status ${response.status}`));
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

  /** @param {Resultset | Resultset[]} resultset */
  #setResults(resultset) {
    if (resultset.length === 0) {
      this.#unsetResults();
      return;
    }
    this.#emptyResultset.textContent = null;
    (() => {
      /** @param {Resultset} */
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
      /** @type {SearchBoxSearchFieldAttributeFn} */
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
