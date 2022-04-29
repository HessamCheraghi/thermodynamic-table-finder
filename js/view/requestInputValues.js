export default function () {
  const result = {
    substance: document.querySelector("select").value,
    temperature: document.querySelector("#temperature").value,
    pressure: document.querySelector("#pressure").value,
    specificVolume: document.querySelector("#specific-volume").value,
    internalEnergy: document.querySelector("#internal-energy").value,
    specificEnthalpy: document.querySelector("#specific-enthalpy").value,
    specificEntropy: document.querySelector("#specific-entropy").value,
    quality: document.querySelector("#quality").value,
  };
  for (const prop in result) {
    if (result[prop] === "") {
      result[prop] = null;
    } else {
      result[prop] = Number(result[prop]);
    }
  }
  return result;
}
