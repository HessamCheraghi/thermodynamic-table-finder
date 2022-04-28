export default function (table, index, propertyValue) {
  const firstInTable = table[0][index];
  const lastInTable = table.slice(-1)[0][index];
  const arr = [firstInTable, lastInTable, propertyValue];

  if (firstInTable < lastInTable) {
    arr.sort((a, b) => a - b);
  } else if (firstInTable > lastInTable) {
    arr.sort((a, b) => b - a);
  }

  if (arr[0] === propertyValue) {
    return [false, "before"];
  } else if (arr[1] === propertyValue) {
    return [true, undefined];
  } else if (arr[2] === propertyValue) {
    return [false, "after"];
  }
}
