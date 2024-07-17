import {
  durationsModel,
  orderbyModel,
  participantsModel,
  typesModel,
} from "@components/boredapi-searchbox/boredapi-searchbox.model.js";
import { htmlSelectOption } from "@components/boredapi-searchbox/templates/boredapi-searchbox-select-option.html.js";
import { html } from "@components/boredapi-searchbox/templates/boredapi-searchbox.html.js";
import { Component } from "@components/component.js";
import { utils } from "@utils/utils.js";

export class BoredAPISearchBox extends Component {
  static #DEFAULT_SEARCH_DESCRIPTION = "Search Bored API";
  static #DEFAULT_MAX_RESULTS = 50;
  static #SEARCH_FIELDS_ATTRIBUTES = ["type", "participants", "duration"];
  static get observedAttributes() {
    return ["max-results", "search-description", "search-fields"];
  }

  #iMaxResults;
  #iSearchDescription;
  #iSearchFields;

  constructor() {
    super();
    this.#iMaxResults = this.getAttribute("max-results") ?? BoredAPISearchBox.#DEFAULT_MAX_RESULTS;
    this.#iSearchDescription =
      this.getAttribute("search-description") ?? BoredAPISearchBox.#DEFAULT_SEARCH_DESCRIPTION;
    this.#iSearchFields = this.#setSearchFields(this.getAttribute("search-fields"));
    this.shadowRoot.appendChild(
      (() => {
        const types = typesModel.map((type) =>
          htmlSelectOption({
            value: type,
            selected: type === this.#iSearchFields?.type,
            textContent: utils.setDisplay.types(type),
          })
        );
        types.unshift(htmlSelectOption({ textContent: "Choose type" }));

        const participants = participantsModel.map((qty) =>
          htmlSelectOption({
            value: qty,
            selected: qty === this.#iSearchFields?.participants.toString(),
            textContent: utils.setDisplay.participants(qty),
          })
        );
        participants.unshift(htmlSelectOption({ textContent: "Choose participants" }));

        const durations = durationsModel.map((duration) =>
          htmlSelectOption({
            value: duration,
            selected: duration === this.#iSearchFields?.duration,
            textContent: utils.setDisplay.durations(duration),
          })
        );
        durations.unshift(htmlSelectOption({ textContent: "Choose duration" }));

        const orderbys = [];
        orderbyModel.fields.forEach((field) =>
          orderbyModel.values.forEach((value) => {
            const option = htmlSelectOption({
              value: `${field}-${value}`,
              textContent: utils.setDisplay.orderbys(field, value),
            });
            orderbys.push(option);
          })
        );
        orderbys.unshift(htmlSelectOption({ textContent: "Choose sort order" }));

        const template = document.createElement("template");
        template.innerHTML = html({
          iSearchDescription: this.#iSearchDescription,
          types: types,
          participants: participants,
          durations: durations,
          orderbys: orderbys,
          iMaxResults: this.#iMaxResults,
        });
        return template.content.cloneNode(true);
      })()
    );
  }

  connectedCallback() {
    this.#setSearchButtonEventListener();
    this.#setMaxResultsAttribute();
  }

  /**
   * @param {string} searchFieldsAttribute
   * @returns {Object | null}
   */
  #setSearchFields = (searchFieldsAttribute) => {
    try {
      if (!searchFieldsAttribute) {
        return null;
      }
      const searchFields = JSON.parse(searchFieldsAttribute.replace(/'/g, '"'));
      Object.keys(searchFields)
        .filter((key) => !BoredAPISearchBox.#SEARCH_FIELDS_ATTRIBUTES.includes(key))
        .forEach((key) => delete searchFields[key]);
      return Object.keys(searchFields).length >= 1 ? searchFields : null;
    } catch (_error) {
      return null;
    }
  };

  #setSearchButtonEventListener() {
    const searchButton = this.shadowRoot.querySelector("#searchBtn");
    searchButton.addEventListener("click", (_event) => this.#searchQueryHandler());
  }

  #setMaxResultsAttribute() {
    if (!this.getAttribute("max-results")) {
      this.shadowRoot.host.setAttribute("max-results", BoredAPISearchBox.#DEFAULT_MAX_RESULTS);
    }
  }

  #searchQueryHandler() {
    const searchObj = {};
    this.applyActions({
      setData: () => {
        const queryElements = [
          "select",
          "input[type='number']",
          "input[type='text']",
          "input[type='hidden']",
        ]
          .map((e) => `#search-form ${e}`)
          .join(", ");
        Array.from(this.shadowRoot.querySelectorAll(queryElements))
          .filter((element) => element.value !== "")
          .forEach((element) => (searchObj[element.id] = element.value));
      },
      dispatchEvent: () => {
        this.findComponent({ selector: "boredapi-searchresults" }).dispatchEvent(
          new CustomEvent("searchEvent", {
            bubbles: true,
            composed: true,
            detail: { searchObj },
          })
        );
      },
    });
  }

  /**
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    switch (true) {
      case name === "max-results":
        this.#newMaxResultsHandler({ maxResults: newValue });
        break;
      case name === "search-description":
        this.#searchDescriptionHandler({ searchDescription: newValue });
        break;
      case name === "search-fields":
        this.#searchFieldsHandler({ searchFields: newValue });
    }
  }

  /** @param {{ maxResults: string }} */
  #newMaxResultsHandler({ maxResults }) {
    this.#iMaxResults = maxResults;
    this.shadowRoot.querySelector("#maxResults").value = maxResults;
  }

  /** @param {{ searchDescription: string }} */
  #searchDescriptionHandler({ searchDescription }) {
    this.#iSearchDescription = searchDescription;
    this.shadowRoot.querySelector("#searchDescription").textContent = searchDescription;
  }

  /** @param {{ searchFields: string }} */
  #searchFieldsHandler({ searchFields }) {
    this.#iSearchFields = this.#setSearchFields(searchFields);
    const newValues = {
      type: null,
      participants: null,
      duration: null,
    };
    /**
     * @param {string[]} model
     * @param {string} key
     * @returns {boolean}
     */
    const modelIncludesSearchValue = (model, key) => model.includes(`${this.#iSearchFields[key]}`);
    this.#iSearchFields &&
      Object.keys(this.#iSearchFields)
        .filter((key) => BoredAPISearchBox.#SEARCH_FIELDS_ATTRIBUTES.includes(key))
        .filter((key) => {
          switch (true) {
            case key === "type":
              return modelIncludesSearchValue(typesModel, key);
            case key === "participants":
              return modelIncludesSearchValue(participantsModel, key);
            case key === "duration":
              return modelIncludesSearchValue(durationsModel, key);
          }
          return false;
        })
        .forEach((key) => (newValues[key] = this.#iSearchFields[key]));

    /**
     * @param {HTMLOptionElement[]} options
     * @param {string} key
     */
    const removeCurrentSelectedAttribute = (options, key) => {
      options
        .filter((option) => option.value !== newValues[key])
        .find((option) => option.hasAttribute("selected"))
        ?.removeAttribute("selected");
    };
    /**
     * @param {HTMLOptionElement[]} options
     * @param {string} key
     */
    const addNewSelectedAttribute = (options, key) => {
      options
        .find((option) => option.value === `${newValues[key]}`)
        ?.setAttribute("selected", true);
    };
    Object.keys(newValues).forEach((key) => {
      const options = Array.from(this.shadowRoot.querySelectorAll(`select[id="${key}"] option`));
      removeCurrentSelectedAttribute(options, key);
      addNewSelectedAttribute(options, key);
    });
  }
}
