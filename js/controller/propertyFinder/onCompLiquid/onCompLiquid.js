import twoDimensionalSearch from "../../twoDimensionalSearch/index.js";
import edgeCaseInterpolation from "./edgeCaseInterpolation.js";
import doubleInterpolator from "../doubleInterpolator.js";
import inputReader from "../inputReader.js";
import ancillary from "./ancillary.js";
import fallback from "../fallback/index.js";
export default function (tables, inputValues) {
  const substance = inputValues.substance;
  if (substance !== 1) {
    // only water has compress liquid table
    return fallback(tables, inputValues, "sat.liquid");
  }
  const propsToStart = inputReader(inputValues);
  const table = tables.b14;
  const searchResult = twoDimensionalSearch(table, ...propsToStart);
  const outputValues = { ...inputValues };

  console.log("");
  console.log(`searching Compressed Liquid Water... (TABLE B.1.4)`);
  console.log(searchResult.statusMessage);
  let finalResult;
  if (searchResult.statusCode === "101" || searchResult.statusCode === "200101" || searchResult.statusCode === "300101") {
    console.log("didn't found requested values in Compressed Liquid tables take Saturated liquid values instead =>");
    return fallback(tables, inputValues, "sat.liquid");
  }
  if (searchResult.statusCode === "102" || searchResult.statusCode === "200102" || searchResult.statusCode === "300102") {
    console.error("out of table");
  }
  if (searchResult.statusCode === "200200") {
    finalResult = searchResult.result;
  }
  if (searchResult.statusCode === "200300" || searchResult.statusCode === "300200") {
    finalResult = ancillary(table, searchResult.result, propsToStart);
    searchResult.result.forEach((array) => console.log(`[${array.join(", ")}]`));
  }
  if (searchResult.statusCode === "300300") {
    finalResult = doubleInterpolator(table, searchResult.result, propsToStart);
  }
  if (searchResult.statusCode === "300200300" || searchResult.statusCode === "300300200") {
    finalResult = edgeCaseInterpolation(table, searchResult.result, searchResult.statusCode, propsToStart);
  }

  //#region return results here!
  console.log("");
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
