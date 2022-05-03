import onSatVapor from "./onSatVapor/index.js";
import onSupVapor from "./onSupVapor/index.js";
import onCompLiquid from "./onCompLiquid/index.js";
import fallback from "./fallback/index.js";
/**
 *
 * @param {object} tables all thermodynamic tables
 * @param {string} phase phase
 * @param {Object.<string, ?number>} inputValues an object containing all properties and their values (value can be null)
 * @returns {Object.<string, ?number>} an object containing all calculated values
 */
export default function (tables, phase, inputValues) {
  if (phase === "sat.vapor") {
    return onSatVapor(tables, inputValues);
  } else if (phase === "sup.vapor") {
    return onSupVapor(tables, inputValues);
  } else if (phase === "comp.liquid") {
    return onCompLiquid(tables, inputValues);
  } else if (phase === "sat.liquid") {
    return fallback(tables, inputValues, "sat.liquid");
  } else if (phase === "sat.vapor(fallback)") {
    return fallback(tables, inputValues, "sat.vapor");
  }
}
