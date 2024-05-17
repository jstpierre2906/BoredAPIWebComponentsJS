import { Component } from "@components/component.js";

export class BoredAPISearchBox extends Component {
  constructor() {
    super();
    this.shadowRoot.appendChild(
      (() => {
        const template = document.createElement("template");
        template.innerHTML = /*html*/ `
          <link rel="stylesheet" href="/src/components/boredapi-search-box/boredapi-search-box.css" />
          <div>
            <h2>${this.textContent}</h2>
            <h2>Bar</h2>
          </div>
        `;
        return template.content.cloneNode(true);
      })()
    );
  }
}
