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

  /**
   * @param {{selector: string}}
   * @returns {Component}
   */
  selectComponent = ({ selector }) => document.querySelector(selector);
}
