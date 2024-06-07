/**
 * @param {{value: string | number; selected: boolean; textContent: string; }}
 * @returns {HTMLOptionElement as string}
 */
export const htmlSelectOption = ({ value, selected, textContent }) => {
  const selectedAttr = selected ? " selected" : "";
  const valueAttr = value ?? "";
  return /*html*/ `<option value="${valueAttr}"${selectedAttr}>${textContent}</option>`;
};
