import smartSearch from "../smartSearch/index.js";
import interpolator from "../interpolator.js";
import findSubstanceName from "../findSubstanceName.js";
import propertyIndex from "../propertyIndex.js";
import UI from "../../view/index.js";
/**
 *
 * finds phase based on pressure and another property (except temperature)
 * @param {object} tables all thermodynamic tables
 * @param {Object.<string, ?number>} inputValues an object containing all property values
 * @returns {string} returns text explaining phase of the substance
 */
export default function (tables, inputValues) {
  const substance = inputValues.substance;
  const substanceName = findSubstanceName(substance);

  // store specific table
  const table = substance === 1 ? tables.b12 : tables[`b${substance}1`];

  // setting indexes to compare based on input values
  let satLiquidIndex;
  let satVaporIndex;
  let valueToCompare;
  if (inputValues.specificVolume) {
    satLiquidIndex = propertyIndex(table, "v_sat.liquid");
    satVaporIndex = propertyIndex(table, "v_sat.vapor");
    valueToCompare = inputValues.specificVolume;
    UI.log("specific volume was detected");
  } else if (inputValues.internalEnergy) {
    satLiquidIndex = propertyIndex(table, "u_sat.liquid");
    satVaporIndex = propertyIndex(table, "u_sat.vapor");
    valueToCompare = inputValues.internalEnergy;
    UI.log("internal energy was detected");
  } else if (inputValues.specificEnthalpy) {
    satLiquidIndex = propertyIndex(table, "h_sat.liquid");
    satVaporIndex = propertyIndex(table, "h_sat.vapor");
    valueToCompare = inputValues.specificEnthalpy;
    UI.log("specific enthalpy was detected");
  } else if (inputValues.specificEntropy) {
    satLiquidIndex = propertyIndex(table, "s_sat.liquid");
    satVaporIndex = propertyIndex(table, "s_sat.vapor");
    valueToCompare = inputValues.specificEntropy;
    UI.log("specific entropy was detected");
  }

  // now start the search in saturated tables
  if (substance === 1) {
    UI.log(`searching Saturated Water Pressure Entry Table... (TABLE B.1.2)`);
  } else {
    UI.log(`searching Saturated ${substanceName} Table... (TABLE B.${substance}.1)`);
  }
  const pressResult = substance === 1 ? smartSearch(table, 0, inputValues.pressure) : smartSearch(table, "press.", inputValues.pressure);

  // finding phase based on pressure result
  let phase;
  if (pressResult.statusCode === "101") {
    // if the value is less then the first value of the table
    phase = "sat.solid-sat.vapor";

    UI.log(pressResult.statusMessage);
    UI.log(`phase of the substance is ${phase}`);

    return phase;
  } else if (pressResult.statusCode === "102") {
    // if the value is more then the last value of the table
    phase = "sup.vapor";

    UI.log(pressResult.statusMessage);
    UI.log(`phase of the substance is ${phase}`);

    return phase;
  } else if (pressResult.statusCode === "200") {
    // if the exact value has been found in pressure tables
    if (inputValues.substance === 1) {
      UI.log("exact pressure has been found! we shall find the phase in pressure tables");
    } else {
      UI.log("exact pressure has been found! we shall find the phase in temperature tables");
    }

    // start comparison
    const satLiquid = pressResult.result[satLiquidIndex];
    const satVapor = pressResult.result[satVaporIndex];

    if (valueToCompare < satLiquid) {
      UI.log(`valueToCompare < satLiquid => ${valueToCompare} < ${satLiquid}`);
      phase = "comp.liquid";
    } else if (valueToCompare > satVapor) {
      UI.log(`valueToCompare > satVapor => ${valueToCompare} > ${satVapor}`);
      phase = "sup.vapor";
    } else if (valueToCompare > satLiquid && valueToCompare < satVapor) {
      UI.log(`satLiquid < valueToCompare < satVapor => ${satLiquid} < ${valueToCompare} < ${satVapor}`);
      phase = "sat.vapor";
    }
    UI.log(`phase of the substance is ${phase}`);

    return phase;
  } else if (pressResult.statusCode === "300") {
    // if the exact value has not been found in temperature (or pressure in water)tables
    UI.log(pressResult.statusMessage);

    const pressureIndex = substance === 1 ? 0 : 1;
    // interpolate values for saturation liquid and saturation vapor

    const x = [
      inputValues.pressure,
      pressResult.result[0][pressureIndex],
      pressResult.result[1][pressureIndex],
      pressResult.result[0][satLiquidIndex],
      pressResult.result[1][satLiquidIndex],
    ];
    const y = [
      inputValues.pressure,
      pressResult.result[0][pressureIndex],
      pressResult.result[1][pressureIndex],
      pressResult.result[0][satVaporIndex],
      pressResult.result[1][satVaporIndex],
    ];
    UI.log(`[${x.join(", ")}]`);
    UI.log(`[${y.join(", ")}]`);
    const satLiquid = interpolator(...x);
    const satVapor = interpolator(...y);

    // start comparison
    if (valueToCompare < satLiquid) {
      UI.log(`valueToCompare < satLiquid => ${valueToCompare} < ${satLiquid}`);
      phase = "comp.liquid";
    } else if (valueToCompare > satVapor) {
      UI.log(`valueToCompare > satVapor => ${valueToCompare} > ${satVapor}`);
      phase = "sup.vapor";
    } else if (valueToCompare > satLiquid && valueToCompare < satVapor) {
      UI.log(`satLiquid < valueToCompare < satVapor => ${satLiquid} < ${valueToCompare} < ${satVapor}`);
      phase = "sat.vapor";
    }
    UI.log(`phase of the substance is ${phase}`);

    return phase;
  } else {
    // if somehow wrong of status codes were reported
    console.error("you tried very hard to find a bug in this app, congratulations!");
  }
}
