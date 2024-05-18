import { Component } from "@components/component.js";
import {
  durationsModel,
  orderbyModel,
  participantsModel,
  typesModel,
} from "./boredapi-searchbox.model.js";

export class BoredAPISearchBox extends Component {
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
        template.innerHTML = /*html*/ `
          <link rel="stylesheet" href="/src/components/boredapi-searchbox/boredapi-searchbox.css" />
          <div>
            <h2>${this.textContent}</h2>
            <form>
              <div>
                <label for="activityId">ID</label>
                <input type="number" id="activityId" maxlength="7" placeholder="0000000" />
              </div>
              <div>
                <label for="description">Description</label>
                <input type="text" id="description" placeholder="Some description" />
              </div>
              <div>
                <label for="type">Type</label>
                <select id="type">${types.join("")}</select>
              </div>
              <div>
                <label for="participants">Participants</label>
                <select id="participants">${participants.join("")}</select>
              </div>
              <div>
                <label for="duration">Duration</label>
                <select id="duration">${durations.join("")}</select>
              </div>
              <div>
                <label for="orderby">Order by</label>
                <select id="orderby">${orderbys.join("")}</select>
              </div>
              <div>
                <input id="maxResults" type="hidden" value="${this.iMaxResults}" />
                <input id="resetBtn" type="reset" value="Reset" />
                <input id="searchBtn" type="button" value="Search" />
              </div>
            </form>
          </div>
        `;
        return template.content.cloneNode(true);
      })()
    );
  }
}
