import onPressureTemperature from "./onPressureTemperature.js";
import onTemperature from "./onTemperature.js";
import onPressure from "./onPressure.js";
import UI from "../../view/index.js";
/**
 *
 * @param {object} tables all thermodynamic tables
 * @param {Object.<string, ?number>} inputValues an object containing all property values
 * @returns {string} phase
 */
export default function (tables, inputValues) {
  let phase;
  if (inputValues.temperature && inputValues.pressure) {
    // send data to pressure temperature function
    phase = onPressureTemperature(tables, inputValues);
  } else if (inputValues.quality !== null) {
    // send... you already know the phase!
    UI.log("quality value was detected");
    if (inputValues.quality === 0) {
      phase = "sat.liquid";
      UI.log("phase of the substance is sat.liquid => quality = 0");
    } else if (inputValues.quality === 1) {
      phase = "sat.vapor(fallback)";
      UI.log("phase of the substance is sat.vapor => quality = 1");
    } else {
      phase = "sat.vapor";
      UI.log("phase of the substance is sup.vapor => 0 < quality < 1 ");
    }
  } else if (inputValues.temperature) {
    // send data to temperature only function
    phase = onTemperature(tables, inputValues);
  } else if (inputValues.pressure) {
    // send data to pressure only function
    phase = onPressure(tables, inputValues);
  } else {
    console.error("there is a problem in phase finder !");
  }
  return phase;
}
