import { html } from "@components/boredapi-searchbox/boredapi-searchbox.html.js";
import { htmlSelectOption } from "@components/boredapi-searchbox/boredapi-searchbox-select-option.html.js";
import {
  durationsModel,
  orderbyModel,
  participantsModel,
  typesModel,
} from "@components/boredapi-searchbox/boredapi-searchbox.model.js";
import { Component } from "@components/component.js";

export class BoredAPISearchBox extends Component {
  static get observedAttributes() {
    return ["max-results", "search-description"];
  }
  static DEFAULT_SEARCH_DESCRIPTION = "Search Bored API";
  iMaxResults;
  iSearchDescription;
  constructor() {
    super();
    this.iMaxResults = !isNaN(this.getAttribute("max-results"))
      ? +this.getAttribute("max-results")
      : 50;
    this.iSearchDescription =
      this.getAttribute("search-description") ?? BoredAPISearchBox.DEFAULT_SEARCH_DESCRIPTION;
    const toSentenceCase = (str) => str.substring(0, 1).toUpperCase() + str.substring(1);
    this.shadowRoot.appendChild(
      (() => {
        const types = typesModel.map((type) =>
          htmlSelectOption({
            value: type,
            textContent: type === "diy" ? type.toUpperCase() : toSentenceCase(type),
          })
        );
        types.unshift(htmlSelectOption({ textContent: "Choose type" }));

        const participants = participantsModel.map((qty) =>
          htmlSelectOption({ value: qty, textContent: qty.replace("+", " or more") })
        );
        participants.unshift(htmlSelectOption({ textContent: "Choose participants" }));

        const durations = durationsModel.map((duration) =>
          htmlSelectOption({ value: duration, textContent: toSentenceCase(duration) })
        );
        durations.unshift(htmlSelectOption({ textContent: "Choose duration" }));

        const orderbys = [];
        orderbyModel.fields.forEach((field) =>
          orderbyModel.values.forEach((value) =>
            orderbys.push(
              htmlSelectOption({
                value: `${field}-${value}`,
                textContent: `${toSentenceCase(field)} - ${value.toUpperCase()}`,
              })
            )
          )
        );
        orderbys.unshift(htmlSelectOption({ textContent: "Choose sort order" }));

        const template = document.createElement("template");
        template.innerHTML = html({
          iSearchDescription: this.iSearchDescription,
          types: types,
          participants: participants,
          durations: durations,
          orderbys: orderbys,
          iMaxResults: this.iMaxResults,
        });
        return template.content.cloneNode(true);
      })()
    );
    const searchButton = this.shadowRoot.querySelector("#searchBtn");
    searchButton.addEventListener("click", (_event) => this.searchQueryHandler());
  }

  searchQueryHandler() {
    const searchQuery = {};
    this.applyActions({
      setData: () => {
        const elementsList = this.shadowRoot.querySelectorAll(
          "select, input[type='number'], input[type='text'], input[type='hidden']"
        );
        Array.from(elementsList)
          .map((element) => element.id)
          .forEach((id) => (searchQuery[id] = this.shadowRoot.querySelector(`#${id}`).value));
      },
      dispatchEvent: () => {
        this.findComponent({ selector: "boredapi-searchresults" }).dispatchEvent(
          new CustomEvent("newSearchQueryEvent", {
            bubbles: true,
            composed: true,
            detail: { searchQuery: searchQuery },
          })
        );
      },
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (true) {
      case name === "max-results":
        this.newMaxResultsHandler({ maxResults: newValue });
        break;
      case name === "search-description":
        this.searchDescriptionHandler({ searchDescription: newValue });
    }
  }

  newMaxResultsHandler({ maxResults }) {
    this.iMaxResults = +maxResults;
    this.shadowRoot.querySelector("#maxResults").value = maxResults;
  }

  searchDescriptionHandler({ searchDescription }) {
    this.iSearchDescription = searchDescription;
    this.shadowRoot.querySelector("#searchDescription").textContent = searchDescription;
  }
}
