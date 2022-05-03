export default function (x) {
  document.querySelector("select").value = x.substance;
  document.querySelector("#temperature").value = x.temperature;
  document.querySelector("#pressure").value = x.pressure;
  document.querySelector("#specific-volume").value = x.specificVolume;
  document.querySelector("#internal-energy").value = x.internalEnergy;
  document.querySelector("#specific-enthalpy").value = x.specificEnthalpy;
  document.querySelector("#specific-entropy").value = x.specificEntropy;
  document.querySelector("#quality").value = x.quality;
}
