import propertyIndex from "../propertyIndex.js";
import silentInterpolator from "./silentInterpolator.js";
import UI from "../../view/index.js";
/**
 *
 * @param {number[][]} table a specific thermodynamic table
 * @param {number[][]} result contains exactly 4 arrays with property values
 * @param {[number|string]} propsToStart  filtered version of input values
 * @returns {number[]} interpolated results
 */
export default function (table, result, propsToStart) {
  const firstValueIndex = propertyIndex(table, propsToStart[0]);
  const firstValue = propsToStart[1];
  const secondValueIndex = propertyIndex(table, propsToStart[2]);
  const secondValue = propsToStart[3];
  const firstConclusion = [null, null, null, null, null, null];
  const secondConclusion = [null, null, null, null, null, null];
  const finalConclusion = [null, null, null, null, null, null];

  if (result[0][firstValueIndex] !== result[1][firstValueIndex]) {
    firstConclusion.forEach((_element, i, arr) => {
      if (i === firstValueIndex) {
        arr[i] = firstValue;
      } else {
        arr[i] = silentInterpolator(firstValue, result[0][firstValueIndex], result[1][firstValueIndex], result[0][i], result[1][i]);
      }
    });
    secondConclusion.forEach((_element, i, arr) => {
      if (i === firstValueIndex) {
        arr[i] = firstValue;
      } else {
        arr[i] = silentInterpolator(firstValue, result[2][firstValueIndex], result[3][firstValueIndex], result[2][i], result[3][i]);
      }
    });
  } else {
    firstConclusion.forEach((_element, i, arr) => {
      if (i === secondValueIndex) {
        arr[i] = secondValue;
      } else {
        arr[i] = silentInterpolator(secondValue, result[0][secondValueIndex], result[1][secondValueIndex], result[0][i], result[1][i]);
      }
    });
    secondConclusion.forEach((_element, i, arr) => {
      if (i === secondValueIndex) {
        arr[i] = secondValue;
      } else {
        arr[i] = silentInterpolator(secondValue, result[2][secondValueIndex], result[3][secondValueIndex], result[2][i], result[3][i]);
      }
    });
  }

  if (firstConclusion[firstValueIndex] !== secondConclusion[firstValueIndex]) {
    finalConclusion.forEach((_element, i, arr) => {
      if (i === firstValueIndex) {
        arr[i] = firstValue;
      } else {
        arr[i] = silentInterpolator(firstValue, firstConclusion[firstValueIndex], secondConclusion[firstValueIndex], firstConclusion[i], secondConclusion[i]);
      }
    });
  } else {
    finalConclusion.forEach((_element, i, arr) => {
      if (i === secondValueIndex) {
        arr[i] = secondValue;
      } else {
        arr[i] = silentInterpolator(
          secondValue,
          firstConclusion[secondValueIndex],
          secondConclusion[secondValueIndex],
          firstConclusion[i],
          secondConclusion[i]
        );
      }
    });
  }
  UI.log("");
  UI.log("oh no heaviest calculation for this app !!!");
  UI.log("- DOUBLE INTERPOLATION -");
  UI.log("");
  UI.log("first this was result of search =>");
  result.forEach((array) => UI.log(`[${array.join(", ")}]`));
  UI.log("");
  UI.log("... then result of first interpolation =>");

  UI.log(`[${firstConclusion.join(", ")}]`);
  UI.log(`[${secondConclusion.join(", ")}]`);

  UI.log("");
  UI.log("and now the final result, tada!!!");
  UI.log(`[${finalConclusion.join(", ")}]`);

  return finalConclusion;
}
