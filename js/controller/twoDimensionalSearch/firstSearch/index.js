import isInsideTable from "./isInsideTable.js";
import findSurrounding from "./findSurrounding.js";
export default function (table, pressure) {
  const pressureIndex = 0;

  // sees if pressure value is inside the table or not
  const [isInTable, beforeOrAfter] = isInsideTable(table, pressureIndex, pressure);
  if (!isInTable) {
    return {
      statusCode: `1${beforeOrAfter === "before" ? "1" : "2"}`,
      statusMessage: `pressure value is out of table (${beforeOrAfter === "before" ? "less then the first" : "more then the last"} value of the table)`,
      result: undefined,
    };
  }

  // searches in table to find the exact pressure arrays
  const found = table.filter((arr) => arr[pressureIndex] === pressure);
  if (found.length !== 0) {
    return {
      statusCode: "20",
      statusMessage: "exact pressure value has been found",
      result: found,
    };
  }
  const surrounding = findSurrounding(table, pressureIndex, pressure);
  if (surrounding) {
    return {
      statusCode: "30",
      statusMessage: "there was no exact pressure value but surrounding values has been found",
      result: surrounding,
    };
  }
}
