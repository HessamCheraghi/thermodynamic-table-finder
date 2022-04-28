import smartSearch from "../smartSearch/index.js";
import interpolator from "../interpolator.js";
import findSubstanceName from "./findSubstanceName.js";
/**
 *
 * finds state based on input values
 * @param {number[][]} tables all thermodynamic tables
 * @param {Object.<string, ?number>} inputValues an object containing all property values
 * @returns {string} returns text explaining state of the substance
 */
export default function (tables, inputValues) {
  const substance = inputValues.substance;
  if (substance === 1) {
    // if it's water
    console.log("searching Saturated Water Temperature Entry... (TABLE B.1.1)");
    const tempResult = smartSearch(tables.b11, "temp.", inputValues.temperature);
    let state;
    if (tempResult.statusCode === "101") {
      // if the value is less then the first value of the table
      state = "sat.solid-sat.vapor";

      console.log(tempResult.statusMessage);
      console.log(`state of the substance is ${state}`);

      return state;
    } else if (tempResult.statusCode === "102") {
      // if the value is more then the last value of the table
      state = "sup.vapor";

      console.log(tempResult.statusMessage);
      console.log(`state of the substance is ${state}`);

      return state;
    } else if (tempResult.statusCode === "200") {
      // if the exact value has been found in temperature tables
      state = inputValues.pressure > tempResult.result[1] ? "comp.liquid" : "sup.vapor";

      console.log("exact temperature has been found! we shall find the state in temperature tables");
      console.log(`state of the substance is ${state}`);

      return state;
    } else if (tempResult.statusCode === "300") {
      // if the exact value has not been found in temperature tables
      console.log("didn't found exact temperature! let's take a quick look in pressure tables");
    } else {
      // if somehow wrong of status codes were reported
      console.error("there are some serious problems in your app");
    }

    // now after searching temperature table if still didn't return state then search pressure table
    console.log("searching Saturated Water Pressure Entry... (TABLE B.1.2)");
    const pressResults = smartSearch(tables.b12, 0, inputValues.pressure);

    if (pressResults.statusCode === "200") {
      // if the exact value has been found in pressure tables
      state = inputValues.temperature > pressResults.result[1] ? "sup.vapor" : "comp.liquid";

      console.log("exact pressure has been found! we shall find the state in pressure tables");
      console.log(`state of the substance is ${state}`);

      return state;
    } else if (pressResults.statusCode === "300") {
      // if the exact value has not been found in temperature or pressure tables
      console.log("nope! not here, go back to temperature results");
    } else {
      // if somehow wrong of status codes were reported
      console.error("WOW! HOW DID WE GOT HERE???");
    }

    //interpolate the values from temperature tables
    console.log("start interpolating values from temperature tables");
    const x = [inputValues.temperature, tempResult.result[0][0], tempResult.result[1][0], tempResult.result[0][1], tempResult.result[1][1]];
    const interpValue = interpolator(...x);
    state = inputValues.pressure > interpValue ? "comp.liquid" : "sup.vapor";

    console.log(`state of the substance is ${state}`);

    return state;
  } else {
    // if it's not water
    const substanceName = findSubstanceName(substance);
    console.log(`searching Saturated ${substanceName} Table... (TABLE B.${substance}.1)`);
    const tempResult = smartSearch(tables[`b${substance}1`], "temp.", inputValues.temperature);
    let state;
    if (tempResult.statusCode === "101") {
      // if the value is less then the first value of the table
      state = "sat.solid-sat.vapor";

      console.log(tempResult.statusMessage);
      console.log(`state of the substance is ${state}`);

      return state;
    } else if (tempResult.statusCode === "102") {
      // if the value is more then the last value of the table
      state = "sup.vapor";

      console.log(tempResult.statusMessage);
      console.log(`state of the substance is ${state}`);

      return state;
    } else if (tempResult.statusCode === "200") {
      // if the exact value has been found in temperature tables
      state = inputValues.pressure > tempResult.result[1] ? "comp.liquid" : "sup.vapor";

      console.log("exact temperature has been found! we shall find the state in temperature tables");
      console.log(`state of the substance is ${state}`);

      return state;
    } else if (tempResult.statusCode === "300") {
      // if the exact value has not been found in temperature tables

      console.log("didn't found exact temperature! start interpolating values from temperature tables");
      const x = [inputValues.temperature, tempResult.result[0][0], tempResult.result[1][0], tempResult.result[0][1], tempResult.result[1][1]];
      const interpValue = interpolator(...x);
      state = inputValues.pressure > interpValue ? "comp.liquid" : "sup.vapor";

      console.log(`state of the substance is ${state}`);

      return state;
    } else {
      // if somehow wrong of status codes were reported
      console.error("you tried very hard to find a bug in this app, congratulations!");
    }
  }
}
