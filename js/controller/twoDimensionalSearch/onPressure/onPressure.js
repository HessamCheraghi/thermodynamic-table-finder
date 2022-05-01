import isInsideTable from "./isInsideTable.js";
import findSurrounding from "./findSurrounding.js";
import smartSearch from "../../smartSearch/index.js";
smartSearch;
export default function (table, pressure, secondPropName, secondPropValue) {
  const pressureIndex = 0;

  // sees if pressure value is inside the table or not
  const [isInTable, beforeOrAfter] = isInsideTable(table, pressureIndex, pressure);
  if (!isInTable) {
    return {
      statusCode: `10${beforeOrAfter === "before" ? "1" : "2"}`,
      statusMessage: `pressure value is out of table (${beforeOrAfter === "before" ? "less then the first" : "more then the last"} value of the table)`,
      result: undefined,
    };
  }

  // searches in table to find the exact pressure arrays
  const found = table.filter((arr) => arr[pressureIndex] === pressure);
  if (found.length !== 0) {
    const secondSearch = smartSearch(found, secondPropName, secondPropValue);
    return {
      statusCode: "200" + secondSearch.statusCode,
      statusMessage: "exact pressure value has been found" + `, searching for [${secondPropName}]... ` + secondSearch.statusMessage,
      result: secondSearch.result,
    };
  }
  const surrounding = findSurrounding(table, pressureIndex, pressure);
  if (surrounding) {
    const x = smartSearch(surrounding[0], secondPropName, secondPropValue);
    const y = smartSearch(surrounding[1], secondPropName, secondPropValue);
    console.log(x);
    console.log(y);

    if (x.statusCode === "101" || y.statusCode === "101") {
      return {
        statusCode: "300101",
        statusMessage:
          "there was no exact pressure value but surrounding values has been found" +
          `, searching for [${secondPropName}]...` +
          "value is out of table (less then the first value of the table)",
        result: undefined,
      };
    }
    if (x.statusCode === "102" || y.statusCode === "102") {
      return {
        statusCode: "300102",
        statusMessage:
          "there was no exact pressure value but surrounding values has been found" +
          `, searching for [${secondPropName}]...` +
          "value is out of table (more then the last value of the table)",
        result: undefined,
      };
    }
    if (x.statusCode === "200" && y.statusCode === "200") {
      return {
        statusCode: "300200",
        statusMessage: "there was no exact pressure value but surrounding values has been found" + `, searching for [${secondPropName}]... ` + x.statusMessage,
        result: [x.result, y.result],
      };
    }
    if (x.statusCode === "300" && y.statusCode === "300") {
      return {
        statusCode: "300300",
        statusMessage: "there was no exact pressure value but surrounding values has been found" + `, searching for [${secondPropName}]... ` + x.statusMessage,
        result: [...x.result, ...y.result],
      };
    }
  }
}
