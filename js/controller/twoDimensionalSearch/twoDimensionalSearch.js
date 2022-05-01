import smartSearch from "../smartSearch/index.js";
import onPressure from "./onPressure/index.js";
export default function (table, firstPropName, firstPropValue, secondPropName, secondPropValue) {
  if (firstPropName === "press.") {
    return onPressure(table, firstPropValue, secondPropName, secondPropValue);
  }
  // returns an object with three properties: statusCode, statusMessage, results
  // status code "11" means out of table (less then the first value of the table)
  // status code "12" means out of table (more then the last value of the table)
  // status code "20" means exact solution has been found
  // status code "30" means there was no exact solution but the before and after value has been found
}
