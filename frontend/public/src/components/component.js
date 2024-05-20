export class Component extends HTMLElement {
  shadowRoot = this.attachShadow({ mode: "closed" });

  /** @param {{[key: string]: () => void}} actions */
  applyActions = (actions) => Object.keys(actions).forEach((k) => actions[k]());

  /** @param {{events: string[]}} */
  addListeners = ({ events }) => {
    events.forEach((event) =>
      this.addEventListener(event, (e) => this[event.replace("Event", "Handler")](e.detail))
    );
  };

  setChooseSelectOption = ({ arr, tpl, label }) => {
    arr.unshift(tpl.replace("{value}", "").replace("{textContent}", `Choose ${label}`));
  };

  /**
   * @param {{selector: string}}
   * @returns {Component}
   */
  findComponent = ({ selector }) => document.querySelector(selector);
}
