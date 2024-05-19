import { html } from "@components/boredapi-searchresults/boredapi-searchresults.html.js";
import { Component } from "@components/component.js";

export class BoredAPISearchResults extends Component {
  static DEFAULT_SEARCH_DESCRIPTION = "Search Bored API";
  constructor() {
    super();
    this.shadowRoot.appendChild(
      (() => {
        const template = document.createElement("template");
        template.innerHTML = html();
        return template.content.cloneNode(true);
      })()
    );
  }
}
