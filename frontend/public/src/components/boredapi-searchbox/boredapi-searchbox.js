import { html } from "@components/boredapi-searchbox/boredapi-searchbox.html.js";
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
        const typesTpl = /*html*/ `<option value="{value}">{textContent}</option>`;
        const types = typesModel.map((type, index) =>
          typesTpl
            .replace("{value}", type)
            .replace("{textContent}", type === "diy" ? type.toUpperCase() : toSentenceCase(type))
        );
        this.setChooseSelectOption({ arr: types, tpl: typesTpl, label: "type" });

        const participantsTpl = /*html*/ `<option value="{value}">{textContent}</option>`;
        const participants = participantsModel.map((qty) =>
          participantsTpl
            .replace("{value}", qty)
            .replace("{textContent}", qty.replace("+", " or more"))
        );
        this.setChooseSelectOption({
          arr: participants,
          tpl: participantsTpl,
          label: "participants",
        });

        const durationsTpl = /*html*/ `<option value="{value}">{textContent}</option>`;
        const durations = durationsModel.map((duration) =>
          durationsTpl
            .replace("{value}", duration)
            .replace("{textContent}", toSentenceCase(duration))
        );
        this.setChooseSelectOption({ arr: durations, tpl: durationsTpl, label: "duration" });

        const orderbys = [];
        const orderbysTpl = /*html*/ `<option value="{value}">{textContent}</option>`;
        orderbyModel.fields.forEach((field) =>
          orderbyModel.values.forEach((value) =>
            orderbys.push(
              orderbysTpl
                .replace("{value}", `${field}-${value}`)
                .replace("{textContent}", `${toSentenceCase(field)} - ${value.toUpperCase()}`)
            )
          )
        );
        this.setChooseSelectOption({ arr: orderbys, tpl: orderbysTpl, label: "sort order" });

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
