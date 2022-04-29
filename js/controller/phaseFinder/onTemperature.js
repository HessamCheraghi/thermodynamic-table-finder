import smartSearch from "../smartSearch/index.js";
import interpolator from "../interpolator.js";
import findSubstanceName from "./findSubstanceName.js";
import propertyIndex from "../propertyIndex.js";
/**
 *
 * finds phase based on temperature and another property (except pressure)
 * @param {object} tables all thermodynamic tables
 * @param {Object.<string, ?number>} inputValues an object containing all property values
 * @returns {string} returns text explaining phase of the substance
 */
export default function (tables, inputValues) {
  const substance = inputValues.substance;
  const substanceName = findSubstanceName(substance);

  // store specific table
  const table = tables[`b${substance}1`];

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
  console.log(`searching Saturated ${substanceName} Table... (TABLE B.${substance}.1)`);
  const tempResult = smartSearch(table, "temp.", inputValues.temperature);

  // finding phase based on temperature result
  let phase;
  if (tempResult.statusCode === "101") {
    // if the value is less then the first value of the table
    phase = "sat.solid-sat.vapor";

    console.log(tempResult.statusMessage);
    console.log(`phase of the substance is ${phase}`);

    return phase;
  } else if (tempResult.statusCode === "102") {
    // if the value is more then the last value of the table
    phase = "sup.vapor";

    console.log(tempResult.statusMessage);
    console.log(`phase of the substance is ${phase}`);

    return phase;
  } else if (tempResult.statusCode === "200") {
    // if the exact value has been found in temperature tables
    console.log("exact temperature has been found! we shall find the phase in temperature tables");

    // start comparison
    const satLiquid = tempResult.result[satLiquidIndex];
    const satVapor = tempResult.result[satVaporIndex];
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
  } else if (tempResult.statusCode === "300") {
    // if the exact value has not been found in temperature tables
    console.log(tempResult.statusMessage);

    // interpolate values for saturation liquid and saturation vapor
    const temperatureIndex = propertyIndex(table, "temp.");
    const x = [
      inputValues.temperature,
      tempResult.result[0][temperatureIndex],
      tempResult.result[1][temperatureIndex],
      tempResult.result[0][satLiquidIndex],
      tempResult.result[1][satLiquidIndex],
    ];
    const satLiquid = interpolator(...x);
    const y = [
      inputValues.temperature,
      tempResult.result[0][temperatureIndex],
      tempResult.result[1][temperatureIndex],
      tempResult.result[0][satVaporIndex],
      tempResult.result[1][satVaporIndex],
    ];
    const satVapor = interpolator(...y);

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
