/**
 *
 * @param {number[][]} table a specific thermodynamic tables
 * @param {number} index index of property to find
 * @param {number} propertyValue value of the property
 * @returns {[boolean,?string]} array with a boolean value and position (if it wasn't inside table)
 */
export default function (table, index, propertyValue) {
  const firstInTable = table[0][index];
  const lastInTable = table.slice(-1)[0][index];
  const arr = [firstInTable, lastInTable, propertyValue];

  if (firstInTable < lastInTable) {
    arr.sort((a, b) => a - b);
  } else if (firstInTable > lastInTable) {
    arr.sort((a, b) => b - a);
  }

  if (arr[0] === propertyValue && arr[1] !== propertyValue) {
    return [false, "before"];
  } else if (arr[2] === propertyValue && arr[1] !== propertyValue) {
    return [false, "after"];
  } else if (arr[1] === propertyValue) {
    return [true, undefined];
  }
}
