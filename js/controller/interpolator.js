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
  console.log("interpolating...");
  const y = y1 + ((x - x1) * (y2 - y1)) / (x2 - x1);
  console.log(`${y1} + ((${x} - ${x1}) * (${y2} - ${y1})) / (${x2} - ${x1})   =   ${y}`);
  return y;
}
