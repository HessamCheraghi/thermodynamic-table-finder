/**
 *
 * @param {number[][]} table a specific thermodynamic tables
 * @param {number} index index of property to find
 * @param {number} propertyValue value of the property
 * @returns {number[][]} an array containing surrounding results
 */
export default function (table, index, propertyValue) {
  // first find the size of a row in table
  const rowSize = table[0].length;

  // create a test row containing property value in correct place
  const testRow = [];
  for (let i = 0; i <= rowSize - 1; i++) {
    testRow.push(i === index ? propertyValue : null);
  }

  // now create a temporary table and push test row in it
  const firstInTable = table[0][index];
  const lastInTable = table.slice(-1)[0][index];
  const temporaryTable = table.slice();
  temporaryTable.push(testRow);

  // sort the temporary table based on original table
  if (firstInTable < lastInTable) {
    temporaryTable.sort((a, b) => a[index] - b[index]);
  } else if (firstInTable > lastInTable) {
    temporaryTable.sort((a, b) => b[index] - a[index]);
  }

  // find the index of test data in sorted array
  const testIndex = temporaryTable.findIndex((arr) => arr[index] === propertyValue);

  // return rows which are placed before and after it
  return [temporaryTable[testIndex - 1], temporaryTable[testIndex + 1]];
}
