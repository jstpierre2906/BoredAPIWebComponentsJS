import "./typedefs.js";

export class Component extends HTMLElement {
  shadowRoot = this.attachShadow({ mode: "closed" });

  /** @type {ApplyActionsFn} */
  applyActions = (actions) => Object.keys(actions).forEach((k) => actions[k]());

  /** @type {FindComponentFn} */
  findComponent = ({ selector }) => document.querySelector(selector);
}
