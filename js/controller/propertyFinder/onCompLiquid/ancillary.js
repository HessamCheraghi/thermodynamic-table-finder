import silentInterpolator from "../silentInterpolator.js";
import propertyIndex from "../../propertyIndex.js";
/**
 *
 * @param {number[][]} table a specific thermodynamic table
 * @param {number[][]} result array with tow rows os values
 * @param {[string|number]} propsToStart filtered version of input values
 * @returns {number[]} interpolated results
 */
export default function (table, result, propsToStart) {
  // finding out which value is the middle value
  const x = propertyIndex(table, propsToStart[0]);
  const y = propertyIndex(table, propsToStart[2]);
  const middleValueIndex = result[0][x] !== result[1][x] ? x : result[0][y] !== result[1][y] ? y : undefined;
  const middleValue = result[0][x] !== result[1][x] ? propsToStart[1] : result[0][y] !== result[1][y] ? propsToStart[3] : undefined;

  // make an empty pressure table array
  const output = [null, null, null, null, null, null];

  // fill im the array with interpolated values
  output.forEach((_element, i, arr) => {
    if (i === middleValueIndex) {
      arr[i] = middleValue;
    } else {
      arr[i] = silentInterpolator(middleValue, result[0][middleValueIndex], result[1][middleValueIndex], result[0][i], result[1][i]);
    }
  });
  return output;
}
