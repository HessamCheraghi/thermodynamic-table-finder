export default function ({ substance, temperature, pressure, specificVolume, internalEnergy, specificEnthalpy, specificEntropy, quality }) {
  document.querySelector("select").value = substance;
  document.querySelector("#temperature").value = temperature;
  document.querySelector("#pressure").value = pressure;
  document.querySelector("#specific-volume").value = specificVolume;
  document.querySelector("#internal-energy").value = internalEnergy;
  document.querySelector("#specific-enthalpy").value = specificEnthalpy;
  document.querySelector("#specific-entropy").value = specificEntropy;
  document.querySelector("#quality").value = quality;
}
