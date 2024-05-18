import { BoredAPISearchBox } from "@components/boredapi-searchbox/boredapi-searchbox.js";

[{ name: "boredapi-searchbox", constructor: BoredAPISearchBox }].forEach((component) => {
  customElements.define(component.name, component.constructor);
});
