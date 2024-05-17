import { BoredAPISearchBox } from "@components/boredapi-search-box/boredapi-search-box.js";

[{ name: "boredapi-search-box", constructor: BoredAPISearchBox }].forEach((component) => {
  customElements.define(component.name, component.constructor);
});
