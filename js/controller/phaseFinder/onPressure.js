import smartSearch from "../smartSearch/index.js";
import interpolator from "../interpolator.js";
import findSubstanceName from "../findSubstanceName.js";
import propertyIndex from "../propertyIndex.js";
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
    console.log("specific volume was detected");
  } else if (inputValues.internalEnergy) {
    satLiquidIndex = propertyIndex(table, "u_sat.liquid");
    satVaporIndex = propertyIndex(table, "u_sat.vapor");
    valueToCompare = inputValues.internalEnergy;
    console.log("internal energy was detected");
  } else if (inputValues.specificEnthalpy) {
    satLiquidIndex = propertyIndex(table, "h_sat.liquid");
    satVaporIndex = propertyIndex(table, "h_sat.vapor");
    valueToCompare = inputValues.specificEnthalpy;
    console.log("specific enthalpy was detected");
  } else if (inputValues.specificEntropy) {
    satLiquidIndex = propertyIndex(table, "s_sat.liquid");
    satVaporIndex = propertyIndex(table, "s_sat.vapor");
    valueToCompare = inputValues.specificEntropy;
    console.log("specific entropy was detected");
  }

  // now start the search in saturated tables
  if (substance === 1) {
    console.log(`searching Saturated Water Pressure Entry Table... (TABLE B.1.2)`);
  } else {
    console.log(`searching Saturated ${substanceName} Table... (TABLE B.${substance}.1)`);
  }
  const pressResult = substance === 1 ? smartSearch(table, 0, inputValues.pressure) : smartSearch(table, "press.", inputValues.pressure);

  // finding phase based on pressure result
  let phase;
  if (pressResult.statusCode === "101") {
    // if the value is less then the first value of the table
    phase = "sat.solid-sat.vapor";

    console.log(pressResult.statusMessage);
    console.log(`phase of the substance is ${phase}`);

    return phase;
  } else if (pressResult.statusCode === "102") {
    // if the value is more then the last value of the table
    phase = "sup.vapor";

    console.log(pressResult.statusMessage);
    console.log(`phase of the substance is ${phase}`);

    return phase;
  } else if (pressResult.statusCode === "200") {
    // if the exact value has been found in pressure tables
    if (inputValues.substance === 1) {
      console.log("exact pressure has been found! we shall find the phase in pressure tables");
    } else {
      console.log("exact pressure has been found! we shall find the phase in temperature tables");
    }

    // start comparison
    const satLiquid = pressResult.result[satLiquidIndex];
    const satVapor = pressResult.result[satVaporIndex];

    if (valueToCompare < satLiquid) {
      console.log(`valueToCompare < satLiquid => ${valueToCompare} < ${satLiquid}`);
      phase = "comp.liquid";
    } else if (valueToCompare > satVapor) {
      console.log(`valueToCompare > satVapor => ${valueToCompare} > ${satVapor}`);
      phase = "sup.vapor";
    } else if (valueToCompare > satLiquid && valueToCompare < satVapor) {
      console.log(`satLiquid < valueToCompare < satVapor => ${satLiquid} < ${valueToCompare} < ${satVapor}`);
      phase = "sat.vapor";
    }
    console.log(`phase of the substance is ${phase}`);

    return phase;
  } else if (pressResult.statusCode === "300") {
    // if the exact value has not been found in temperature (or pressure in water)tables
    console.log(pressResult.statusMessage);

    const pressureIndex = substance === 1 ? 0 : 1;
    // interpolate values for saturation liquid and saturation vapor
    const x = [
      inputValues.pressure,
      pressResult.result[0][pressureIndex],
      pressResult.result[1][pressureIndex],
      pressResult.result[0][satLiquidIndex],
      pressResult.result[1][satLiquidIndex],
    ];
    const satLiquid = interpolator(...x);
    const y = [
      inputValues.pressure,
      pressResult.result[0][pressureIndex],
      pressResult.result[1][pressureIndex],
      pressResult.result[0][satVaporIndex],
      pressResult.result[1][satVaporIndex],
    ];
    const satVapor = interpolator(...y);
    console.log(x, y);
    // start comparison
    if (valueToCompare < satLiquid) {
      console.log(`valueToCompare < satLiquid => ${valueToCompare} < ${satLiquid}`);
      phase = "comp.liquid";
    } else if (valueToCompare > satVapor) {
      console.log(`valueToCompare > satVapor => ${valueToCompare} > ${satVapor}`);
      phase = "sup.vapor";
    } else if (valueToCompare > satLiquid && valueToCompare < satVapor) {
      console.log(`satLiquid < valueToCompare < satVapor => ${satLiquid} < ${valueToCompare} < ${satVapor}`);
      phase = "sat.vapor";
    }
    console.log(`phase of the substance is ${phase}`);

    return phase;
  } else {
    // if somehow wrong of status codes were reported
    console.error("you tried very hard to find a bug in this app, congratulations!");
  }
}
