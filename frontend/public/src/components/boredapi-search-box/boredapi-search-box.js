import { Component } from "@components/component.js";

export class BoredAPISearchBox extends Component {
  constructor() {
    super();
    const toSentenceCase = (str) => str.substring(0, 1).toUpperCase() + str.substring(1);
    this.shadowRoot.appendChild(
      (() => {
        const types = [
          "busywork",
          "charity",
          "cooking",
          "diy",
          "education",
          "music",
          "social",
          "recreational",
          "relaxation",
        ].map(
          (type) =>
            /*html*/ `<option value="${type}">${
              type === "diy" ? type.toUpperCase() : toSentenceCase(type)
            }</option>`
        );
        const participants = ["1", "2", "3", "4", "5", "8", "2+", "3+", "4+"].map(
          (qty) => /*html*/ ` <option value="${qty}">${qty.replace("+", " or more")}</option>`
        );
        const durations = ["minutes", "hours", "days", "weeks"].map(
          (duration) =>
            /*html*/ `<option value="${duration}">${toSentenceCase(duration)}</option>`
        );
        const template = document.createElement("template");
        template.innerHTML = /*html*/ `
          <link rel="stylesheet" href="/src/components/boredapi-search-box/boredapi-search-box.css" />
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
                <input id="reserBtn" type="reset" value="Reset" />
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
