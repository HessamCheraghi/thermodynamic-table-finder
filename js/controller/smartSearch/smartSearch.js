import propertyIndex from "../propertyIndex.js";
import isInsideTable from "./isInsideTable.js";
import findSurrounding from "./findSurrounding.js";

/**
 *
 * searches dynamically based on property name and value
 * @param {number[][]} table a specific thermodynamic tables
 * @param {(string|number)} propertyName index of property. if a string was passed searches for index based on property name
 * @param {number} propertyValue value to find
 * @returns {{statusCode:string,statusMessage:string,result:undefined|[number]|[[number]]}} object containing result(s) and conclusion messages
 */
export default function (table, propertyName, propertyValue) {
  // finding the index of property value
  const index = Number.isFinite(propertyName) ? propertyName : propertyIndex(table, propertyName);

  // sees if property value is inside the table or not
  const [isInTable, beforeOrAfter] = isInsideTable(table, index, propertyValue);
  if (!isInTable) {
    return {
      statusCode: `10${beforeOrAfter === "before" ? "1" : "2"}`,
      statusMessage: `value is out of table (${beforeOrAfter === "before" ? "less then the first" : "more then the last"} value of the table)`,
      result: undefined,
    };
  }

  // searches in table to find the exact array
  const found = table.find((arr) => arr[index] === propertyValue);
  if (found) {
    return {
      statusCode: "200",
      statusMessage: `exact ${propertyName} has been found`,
      result: found,
    };
  }
  const surrounding = findSurrounding(table, index, propertyValue);
  if (surrounding) {
    return {
      statusCode: "300",
      statusMessage: `there was no exact ${propertyName} but surrounding values has been found`,
      result: surrounding,
    };
  }

  // returns an object with three properties: statusCode, statusMessage, results
  // status code "11" means out of table (less then the first value of the table)
  // status code "12" means out of table (more then the last value of the table)
  // status code "20" means exact solution has been found
  // status code "30" means there was no exact solution but the before and after value has been found
}
