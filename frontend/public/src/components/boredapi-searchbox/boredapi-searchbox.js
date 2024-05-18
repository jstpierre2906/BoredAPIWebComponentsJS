import { Component } from "@components/component.js";
import { html } from "./boredapi-searchbox.html.js";
import {
  durationsModel,
  orderbyModel,
  participantsModel,
  typesModel,
} from "./boredapi-searchbox.model.js";

export class BoredAPISearchBox extends Component {
  static get observedAttributes() {
    return ["max-results"];
  }
  iMaxResults;
  constructor() {
    super();
    this.iMaxResults = !isNaN(this.getAttribute("max-results"))
      ? +this.getAttribute("max-results")
      : 50;
    const toSentenceCase = (str) => str.substring(0, 1).toUpperCase() + str.substring(1);
    this.shadowRoot.appendChild(
      (() => {
        const types = typesModel.map(
          (type) =>
            /*html*/ `<option value="${type}">${
              type === "diy" ? type.toUpperCase() : toSentenceCase(type)
            }</option>`
        );
        const participants = participantsModel.map(
          (qty) => /*html*/ ` <option value="${qty}">${qty.replace("+", " or more")}</option>`
        );
        const durations = durationsModel.map(
          (duration) => /*html*/ `<option value="${duration}">${toSentenceCase(duration)}</option>`
        );
        const orderbys = [];
        orderbyModel.fields.forEach((field) =>
          orderbyModel.values.forEach((value) =>
            orderbys.push(
              /*html*/ `<option value="${field} - ${value}">${toSentenceCase(
                field
              )} - ${value.toUpperCase()}</option>`
            )
          )
        );
        const template = document.createElement("template");
        template.innerHTML = html({
          textContent: this.textContent,
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
    const data = {};
    this.applyActions({
      setData: () => {
        const elementsList = this.shadowRoot.querySelectorAll(
          "select, input[type='number'], input[type='text'], input[type='hidden']"
        );
        Array.from(elementsList)
          .map((element) => element.id)
          .forEach((id) => (data[id] = this.shadowRoot.querySelector(`#${id}`).value));
      },
      dispatchEvent: () => {
        // this.findComponent({ selector: "boredapi-searchresults" }).dispatchEvent(
        document.dispatchEvent(
          new CustomEvent("newSearchQueryEvent", {
            bubbles: true,
            composed: true,
            detail: { data: data },
          })
        );
      },
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "max-results") this.newMaxResultsHandler({ maxResults: newValue });
  }

  newMaxResultsHandler({ maxResults }) {
    this.iMaxResults = +maxResults;
    this.shadowRoot.querySelector("#maxResults").value = maxResults;
  }
}
