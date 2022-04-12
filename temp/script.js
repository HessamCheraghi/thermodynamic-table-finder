const form = document.getElementById("data");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let base = document.getElementById("base").value;
  base = base
    .replaceAll("P = ", "")
    .replaceAll("kPa (", "")
    .replaceAll(" K)", "")
    .replaceAll("Sat.", `"Sat."`)
    .replaceAll(" ", ",")
    .replaceAll("\n", "],[")
    .replaceAll("−", "-")
    .replaceAll("—", "null");
  base = `[[${base}]]`;
  document.getElementById("base").value = base;

  const data = JSON.parse(base)[0];
  const table1 = JSON.parse(base).slice(1);

  // console.log(data, table1);
  const res1 = [];
  const res2 = [];

  table1.forEach((arr) => {
    const arr1 = arr.slice(0, 5);
    arr1.unshift(data[0]);
    if (arr1[1] === "Sat.") {
      arr1[1] = data[1];
    }
    if (arr1[2] !== null) res1.push(arr1);
  });
  // console.log(res1);

  table1.forEach((arr) => {
    const arr2 = arr.slice(5);
    arr2.unshift(arr[0]);
    arr2.unshift(data[2]);
    if (arr2[1] === "Sat.") arr2[1] = data[3];
    if (arr2[2] !== null) res2.push(arr2);
  });
  console.log(res1.concat(res2));
});
