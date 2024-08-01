import "./typedefs.js";
import "../typedefs.js";
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

  /** @type {SetSearchFieldsFn} */
  #setSearchFields(searchFieldsAttribute) {
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
  }

  connectedCallback() {
    this.#manageIdDescriptionFields();
    this.#setSearchButtonEventListener();
    this.#setResetButtonEventListener();
    this.#setMaxResultsAttribute();
  }

  #manageIdDescriptionFields() {
    // a) +onload set disabled
    // b) on label click
    //    i) +enable one ;
    //   ii) +disable other(s)
    // c) +interlude:
    //    i) +cleanup
    //   ii) +more cleanup
    // d) on blur, if !value, disable

    /** @type {FieldData[]} */
    const fieldsData = [
      {
        name: "activityId",
        label: "ID",
        labelSearch: "Search by activity ID",
        inputElement: null,
        labelElement: null,
      },
      {
        name: "description",
        label: "Description",
        labelSearch: "Search by description",
        inputElement: null,
        labelElement: null,
      },
    ];

    /** @param {ElementLabelFieldData} */
    const enableField = ({ element, label, fieldObj }) => {
      element.removeAttribute("disabled");
      element.style.display = "inline-block";
      label.textContent = fieldObj.label;
      label.style.cursor = "default";
      label.style.textDecoration = "none";
    };

    /** @param {ElementLabelFieldData} */
    const disableField = ({ element, label, fieldObj }) => {
      element.setAttribute("disabled", "");
      element.style.display = "none";
      label.textContent = fieldObj.labelSearch;
      label.style.cursor = "pointer";
      label.style.textDecoration = "underline";
    };

    /** @param {number} currentElementId */
    const disableOtherField = (currentElementId) => {
      const { element, label, fieldObj } = fetchOtherField(currentElementId);
      disableField({ element, label, fieldObj });
  };

    /** @type {QueryElementLabelFn} */
    const queryFieldElement = (fieldDataName) => this.shadowRoot.querySelector(`#${fieldDataName}`);

    /** @type {QueryElementLabelFn} */
    const queryFieldLabel = (fieldDataName) =>
      this.shadowRoot.querySelector(`label[for='${fieldDataName}']`);

    /**  @type {FetchOtherFieldDataFn} */
    const fetchOtherField = (currentElementId) => {
      const fieldObj = fieldsData.find((f) => f.name !== currentElementId);
      return {
        element: queryFieldElement(fieldObj.name),
        label: queryFieldLabel(fieldObj.name),
        fieldObj,
      };
    };

    fieldsData.forEach((fieldData) => {
      const currentElement = queryFieldElement(fieldData.name);
      const currentLabel = queryFieldLabel(fieldData.name);
      if (currentElement.value === "") {
        disableField({ element: currentElement, label: currentLabel, fieldObj: fieldData });
      }
      currentLabel.addEventListener("click", () => {
        enableField({ element: currentElement, label: currentLabel, fieldObj: fieldData });
        disableOtherField(currentElement.id);
      });
      currentElement.addEventListener("blur", () => {
        if (currentElement.value === "") {
          disableField({ element: currentElement, label: currentLabel, fieldObj: fieldData });
        } else {
          disableOtherField(currentElement.id);
        }
      });
    });
  }

  #setSearchButtonEventListener() {
    this.shadowRoot
      .querySelector("#searchBtn")
      .addEventListener("click", () => this.#searchQueryHandler());
  }

  #setResetButtonEventListener() {
    this.shadowRoot
      .querySelector("#resetBtn")
      .addEventListener("click", () => this.shadowRoot.host.removeAttribute("search-fields"));
  }

  #setMaxResultsAttribute() {
    if (!this.getAttribute("max-results")) {
      this.shadowRoot.host.setAttribute("max-results", BoredAPISearchBox.#DEFAULT_MAX_RESULTS);
    }
  }

  #searchQueryHandler() {
    /** @type {SearchObj} */
    const searchObj = {};
    this.applyActions({
      setSearchObj: () => {
        const queryElements = [
          "select",
          "input[type='number']",
          "input[type='text']",
          "input[type='hidden']",
        ]
          .map((e) => `#search-form ${e}`)
          .join(", ");
        Array.from(this.shadowRoot.querySelectorAll(queryElements))
          .filter((element) => element.value !== "" && element.getAttribute("disabled") === null)
          .forEach((element) => (searchObj[element.id] = element.value));
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

  /** @type {AttributeChangedCallbackFn} */
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
    /** @type {ModelIncludesSearchValueFn} */
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

    /** @type {ManageSelectedAttributeFn} */
    const removeCurrentSelectedAttribute = (options, key) => {
      options
        .filter((option) => option.value !== newValues[key])
        .find((option) => option.hasAttribute("selected"))
        ?.removeAttribute("selected");
    };
    /** @type {ManageSelectedAttributeFn} */
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
