import onPressure from "./onPressure/index.js";
import notOnPressure from "./notOnPressure/index.js";
/**
 * searches superheated or saturated tables based on two individual values
 * @param {number[][]} table a specific thermodynamic table (superheated or saturated)
 * @param {string} firstPropName name of the first property to search
 * @param {number} firstPropValue value of the first property
 * @param {string} secondPropName name of the second property to search
 * @param {number} secondPropValue value of the second property to search
 * @returns results of the search
 */
export default function (table, firstPropName, firstPropValue, secondPropName, secondPropValue) {
  if (firstPropName === "press.") {
    return onPressure(table, firstPropValue, secondPropName, secondPropValue);
  } else if (secondPropName === "press.") {
    return onPressure(table, secondPropValue, firstPropName, firstPropValue);
  } else {
    return notOnPressure(table, firstPropName, firstPropValue, secondPropName, secondPropValue);
  }
  // returns an object with three properties: statusCode, statusMessage, results
  // status code "101" means out of table (less then the first value of the table)
  // status code "102" means out of table (more then the last value of the table)
  // status code "200" means exact solution has been found
  // status code "300" means there was no exact solution but the surrounding values has been found
}
