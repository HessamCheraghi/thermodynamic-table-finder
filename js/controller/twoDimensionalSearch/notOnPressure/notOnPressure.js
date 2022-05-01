import smartSearch from "../../smartSearch/index.js";

/**
 *
 * @param {number} table
 * @param {string} firstPropName
 * @param {number} firstPropValue
 * @param {string} secondPropName
 * @param {number} secondPropValue
 * @returns result
 */
export default function (table, firstPropName, firstPropValue, secondPropName, secondPropValue) {
  // console.log({ table, firstPropName, firstPropValue, secondPropName, secondPropValue });

  // convert table into buckets of pressure tables!
  const uniquePressures = [...new Set(table.map((arr) => arr[0]))];
  const pressureBuckets = uniquePressures.map((pressureNumber) => table.filter((arr) => pressureNumber === arr[0]));

  // start the first search
  const firstExact = {
    statusCode: "200",
    statusMessage: `exact ${firstPropName} has been found, searching for ${secondPropName}... `,
    result: [],
  };
  const firstSurrounding = {
    statusCode: "300",
    statusMessage: `there was no exact ${firstPropName} but surrounding values has been found, searching for ${secondPropName}... `,
    result: [[], []],
  };

  pressureBuckets.forEach((bucket) => {
    const x = smartSearch(bucket, firstPropName, firstPropValue);
    if (x.statusCode === "200") {
      firstExact.result.push(x.result);
    }
    if (x.statusCode === "300") {
      firstSurrounding.result[0].push(x.result[0]);
      firstSurrounding.result[1].push(x.result[1]);
    }
  });

  // start the second search
  if (firstSurrounding.result[0].length !== 0) {
    const lesser = smartSearch(firstSurrounding.result[0], secondPropName, secondPropValue);
    const greater = smartSearch(firstSurrounding.result[1], secondPropName, secondPropValue);
    const conclusion = {
      statusCode: firstSurrounding.statusCode + lesser.statusCode,
      statusMessage: firstSurrounding.statusMessage + lesser.statusMessage,
      result: [...lesser.result, ...greater.result],
    };
    if (conclusion.result.length !== 4) throw new Error("something went wrong! try searching manually");
    return conclusion;
  }
  if (firstExact.result.length !== 0) {
    const secondSearch = smartSearch(firstExact.result, secondPropName, secondPropValue);
    return {
      statusCode: firstExact.statusCode + secondSearch.statusCode,
      statusMessage: firstExact.statusMessage + secondSearch.statusMessage,
      result: secondSearch.result,
    };
  }
}
