import UI from "../view/index.js";
/**
 *
 * @param {Object.<string, ?number>} outputValues object containing all calculated values
 * @returns {Object.<string, ?number>} finalOutput contains all calculated values rounded to 6 significant digits
 */
export default function (outputValues) {
  UI.log("rounding everything into 6 significant figures...");
  const finalOutput = {};
  for (const prop in outputValues) {
    if (Number.isFinite(outputValues[prop])) {
      finalOutput[prop] = Number(outputValues[prop].toPrecision(6));
    } else {
      finalOutput[prop] = "";
    }
  }
  return finalOutput;
}
