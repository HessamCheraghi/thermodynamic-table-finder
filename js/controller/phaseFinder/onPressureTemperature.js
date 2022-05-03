import smartSearch from "../smartSearch/index.js";
import interpolator from "../interpolator.js";
import findSubstanceName from "../findSubstanceName.js";
import UI from "../../view/index.js";
/**
 *
 * finds phase based on pressure and temperature
 * @param {number[][]} tables all thermodynamic tables
 * @param {Object.<string, ?number>} inputValues an object containing all property values
 * @returns {string} returns text explaining phase of the substance
 */
export default function (tables, inputValues) {
  const substance = inputValues.substance;
  if (substance === 1) {
    // if it's water
    UI.log("searching Saturated Water Temperature Entry... (TABLE B.1.1)");
    const tempResult = smartSearch(tables.b11, "temp.", inputValues.temperature);
    let phase;
    if (tempResult.statusCode === "101") {
      // if the value is less then the first value of the table
      phase = "sat.solid-sat.vapor";

      UI.log(tempResult.statusMessage);
      UI.log(`phase of the substance is ${phase}`);

      return phase;
    } else if (tempResult.statusCode === "102") {
      // if the value is more then the last value of the table
      phase = "sup.vapor";

      UI.log(tempResult.statusMessage);
      UI.log(`phase of the substance is ${phase}`);

      return phase;
    } else if (tempResult.statusCode === "200") {
      // if the exact value has been found in temperature tables
      phase = inputValues.pressure > tempResult.result[1] ? "comp.liquid" : "sup.vapor";

      UI.log("exact temperature has been found! we shall find the phase in temperature tables");
      UI.log(`phase of the substance is ${phase}`);

      return phase;
    } else if (tempResult.statusCode === "300") {
      // if the exact value has not been found in temperature tables
      UI.log("didn't found exact temperature! let's take a quick look in pressure tables");
    } else {
      // if somehow wrong of status codes were reported
      console.error("there are some serious problems in your app");
    }

    // now after searching temperature table if still didn't return phase then search pressure table
    UI.log("searching Saturated Water Pressure Entry... (TABLE B.1.2)");
    const pressResults = smartSearch(tables.b12, 0, inputValues.pressure);

    if (pressResults.statusCode === "200") {
      // if the exact value has been found in pressure tables
      phase = inputValues.temperature > pressResults.result[1] ? "sup.vapor" : "comp.liquid";

      UI.log("exact pressure has been found! we shall find the phase in pressure tables");
      UI.log(`phase of the substance is ${phase}`);

      return phase;
    } else if (pressResults.statusCode === "300") {
      // if the exact value has not been found in temperature or pressure tables
      UI.log("nope! not here, go back to temperature results");
    } else {
      // if somehow wrong of status codes were reported
      console.error("WOW! HOW DID WE GOT HERE???");
    }

    //interpolate the values from temperature tables
    UI.log("start interpolating values from temperature tables");
    const x = [inputValues.temperature, tempResult.result[0][0], tempResult.result[1][0], tempResult.result[0][1], tempResult.result[1][1]];
    const interpValue = interpolator(...x);
    phase = inputValues.pressure > interpValue ? "comp.liquid" : "sup.vapor";

    UI.log(`phase of the substance is ${phase}`);

    return phase;
  } else {
    // if it's not water
    const substanceName = findSubstanceName(substance);
    UI.log(`searching Saturated ${substanceName} Table... (TABLE B.${substance}.1)`);
    const tempResult = smartSearch(tables[`b${substance}1`], "temp.", inputValues.temperature);
    let phase;
    if (tempResult.statusCode === "101") {
      // if the value is less then the first value of the table
      phase = "sat.solid-sat.vapor";

      UI.log(tempResult.statusMessage);
      UI.log(`phase of the substance is ${phase}`);

      return phase;
    } else if (tempResult.statusCode === "102") {
      // if the value is more then the last value of the table
      phase = "sup.vapor";

      UI.log(tempResult.statusMessage);
      UI.log(`phase of the substance is ${phase}`);

      return phase;
    } else if (tempResult.statusCode === "200") {
      // if the exact value has been found in temperature tables
      phase = inputValues.pressure > tempResult.result[1] ? "comp.liquid" : "sup.vapor";

      UI.log("exact temperature has been found! we shall find the phase in temperature tables");
      UI.log(`phase of the substance is ${phase}`);

      return phase;
    } else if (tempResult.statusCode === "300") {
      // if the exact value has not been found in temperature tables

      UI.log("didn't found exact temperature! start interpolating values from temperature tables");
      const x = [inputValues.temperature, tempResult.result[0][0], tempResult.result[1][0], tempResult.result[0][1], tempResult.result[1][1]];
      const interpValue = interpolator(...x);
      phase = inputValues.pressure > interpValue ? "comp.liquid" : "sup.vapor";

      UI.log(`phase of the substance is ${phase}`);

      return phase;
    } else {
      // if somehow wrong of status codes were reported
      console.error("you tried very hard to find a bug in this app, congratulations!");
    }
  }
}
