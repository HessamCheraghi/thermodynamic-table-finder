import silentInterpolator from "../silentInterpolator.js";
import propertyIndex from "../../propertyIndex.js";
/**
 *
 * @param {number[][]} table a specific thermodynamic table
 * @param {number[][]} results contains exactly 3 arrays with property values
 * @param {string} statusCode either `300200300` or `300300200`
 * @param {[number|string]} propsToStart filtered version of input values
 * @returns {number[]} interpolated results
 */
export default function (table, results, statusCode, propsToStart) {
  const firstValueIndex = propertyIndex(table, propsToStart[0]);
  const firstValue = propsToStart[1];
  const secondValueIndex = propertyIndex(table, propsToStart[2]);
  const secondValue = propsToStart[3];
  const exactResults = [];
  const firstSurrounding = [];
  const secondSurrounding = [];
  const interpSurrounding = [];
  const conclusion = [];
  //#region
  if (statusCode === "300200300") {
    results[0].forEach((number) => exactResults.push(number));
    results[1].forEach((number) => firstSurrounding.push(number));
    results[2].forEach((number) => secondSurrounding.push(number));
  }

  if (statusCode === "300300200") {
    results[0].forEach((number) => firstSurrounding.push(number));
    results[1].forEach((number) => secondSurrounding.push(number));
    results[2].forEach((number) => exactResults.push(number));
  }

  if (firstSurrounding[firstValueIndex] !== secondSurrounding[firstValueIndex]) {
    firstSurrounding.forEach((_element, i) => {
      if (i === firstValueIndex) {
        interpSurrounding.push(firstValue);
      } else {
        interpSurrounding.push(
          silentInterpolator(firstValue, firstSurrounding[firstValueIndex], secondSurrounding[firstValueIndex], firstSurrounding[i], secondSurrounding[i])
        );
      }
    });
  } else {
    firstSurrounding.forEach((_element, i) => {
      if (i === secondValueIndex) {
        interpSurrounding.push(secondValue);
      } else {
        interpSurrounding.push(
          silentInterpolator(secondValue, firstSurrounding[secondValueIndex], secondSurrounding[secondValueIndex], firstSurrounding[i], secondSurrounding[i])
        );
      }
    });
  }

  if (exactResults[firstValueIndex] !== interpSurrounding[firstValueIndex]) {
    exactResults.forEach((_element, i) => {
      if (i === firstValueIndex) {
        conclusion.push(firstValue);
      } else {
        conclusion.push(
          silentInterpolator(firstValue, exactResults[firstValueIndex], interpSurrounding[firstValueIndex], exactResults[i], interpSurrounding[i])
        );
      }
    });
  } else {
    exactResults.forEach((_element, i) => {
      if (i === secondValueIndex) {
        conclusion.push(secondValue);
      } else {
        conclusion.push(
          silentInterpolator(secondValue, exactResults[secondValueIndex], interpSurrounding[secondValueIndex], exactResults[i], interpSurrounding[i])
        );
      }
    });
  }
  //#endregion
  console.log("");
  console.log("this is an edge case, get ready! ");
  console.log(`exact array => [${exactResults.join(", ")}]`);
  console.log(`surrounding arrays =>\n [${firstSurrounding.join(", ")}],\n [${secondSurrounding.join(", ")}]`);
  console.log(`interpolating surrounding arrays =>\n [${interpSurrounding.join(", ")}]`);
  console.log(`interpolating two last arrays ...\nfinal result =>\n [${conclusion.join(", ")}]`);

  return conclusion;
}
