import { BoredAPISearchBox } from "@components/boredapi-searchbox/boredapi-searchbox.js";
import { BoredAPISearchResults } from "@components/boredapi-searchresults/boredapi-searchresults.js";

[
  { name: "boredapi-searchbox", constructor: BoredAPISearchBox },
  { name: "boredapi-searchresults", constructor: BoredAPISearchResults },
].forEach((component) => {
  customElements.define(component.name, component.constructor);
});
