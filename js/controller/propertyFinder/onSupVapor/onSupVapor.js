import twoDimensionalSearch from "../../twoDimensionalSearch/index.js";
import edgeCaseInterpolation from "./edgeCaseInterpolation.js";
import findSubstanceName from "../../findSubstanceName.js";
import doubleInterpolator from "../doubleInterpolator.js";
import inputReader from "../inputReader.js";
import ancillary from "./ancillary.js";
import fallback from "../fallback/index.js";
import UI from "../../../view/index.js";
/**
 *
 * @param {object} tables all thermodynamic tables
 * @param {Object.<string, ?number>} inputValues an object containing all property values
 * @returns {Object.<string, ?number>}  an object containing all calculated values
 */
export default function (tables, inputValues) {
  const substance = inputValues.substance;
  const propsToStart = inputReader(inputValues);
  const table = tables[`b${substance}${substance === 1 ? 3 : 2}`];
  const searchResult = twoDimensionalSearch(table, ...propsToStart);
  const outputValues = { ...inputValues };

  UI.log("");
  UI.log(`searching Superheated ${findSubstanceName(substance)}... (TABLE B.${substance}.${substance === 1 ? 3 : 2})`);
  UI.log(searchResult.statusMessage);
  let finalResult;
  if (searchResult.statusCode === "101" || searchResult.statusCode === "200101" || searchResult.statusCode === "300101") {
    UI.log("didn't found requested values in Superheated tables take Saturated Vapor values instead =>");
    return fallback(tables, inputValues, "sat.vapor");
  }
  if (searchResult.statusCode === "102" || searchResult.statusCode === "200102" || searchResult.statusCode === "300102") {
    UI.log("out of table");
  }
  if (searchResult.statusCode === "200200") {
    finalResult = searchResult.result;
    UI.log(` => [${finalResult.join(", ")}]`);
  }
  if (searchResult.statusCode === "200300" || searchResult.statusCode === "300200") {
    finalResult = ancillary(table, searchResult.result, propsToStart);
    searchResult.result.forEach((array) => UI.log(`[${array.join(", ")}]`));
    UI.log(`interpolating...\n => [${finalResult.join(", ")}]`);
  }
  if (searchResult.statusCode === "300300") {
    finalResult = doubleInterpolator(table, searchResult.result, propsToStart);
  }
  if (searchResult.statusCode === "300200300" || searchResult.statusCode === "300300200") {
    finalResult = edgeCaseInterpolation(table, searchResult.result, searchResult.statusCode, propsToStart);
  }

  //#region return results here!
  UI.log("");
  outputValues.pressure = finalResult[0];
  outputValues.temperature = finalResult[1];
  outputValues.specificVolume = finalResult[2];
  outputValues.internalEnergy = finalResult[3];
  outputValues.specificEnthalpy = finalResult[4];
  outputValues.specificEntropy = finalResult[5];
  outputValues.quality = "";
  return outputValues;
  //#endregion
}
