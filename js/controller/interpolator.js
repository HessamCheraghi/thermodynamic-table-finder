import UI from "../view/index.js";
/**
 *
 * @param {number} x
 * @param {number} x1
 * @param {number} x2
 * @param {number} y1
 * @param {number} y2
 * @returns {number}
 */
export default function (x, x1, x2, y1, y2) {
  UI.log("interpolating...");
  const y = y1 + ((x - x1) * (y2 - y1)) / (x2 - x1);
  UI.log(`${y1} + ((${x} - ${x1}) * (${y2} - ${y1})) / (${x2} - ${x1})   =   ${y}`);
  return y;
}
