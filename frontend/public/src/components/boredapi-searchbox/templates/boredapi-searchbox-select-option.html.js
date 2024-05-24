export const htmlSelectOption = ({ value, selected, textContent }) => {
  const selectedAttr = selected ? " selected" : "";
  const valueAttr = value ?? "";
  return /*html*/ `<option value="${valueAttr}"${selectedAttr}>${textContent}</option>`;
};
