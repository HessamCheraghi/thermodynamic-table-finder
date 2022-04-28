export default function () {
  const temperature = document.querySelector("#temperature");
  const pressure = document.querySelector("#pressure");
  const specificVolume = document.querySelector("#specific-volume");
  const specificEnthalpy = document.querySelector("#specific-enthalpy");
  const specificEntropy = document.querySelector("#specific-entropy");
  const quality = document.querySelector("#quality");
  const allInputs = [temperature, pressure, specificVolume, specificEnthalpy, specificEntropy, quality];

  const toggleInputDisable = function (inputElement, disable = true) {
    if (disable) inputElement.value = "";
    inputElement.disabled = disable;
    inputElement.required = !disable;
  };

  //TODO the code below works but needs cleaning
  //check every single input!
  temperature.addEventListener("input", () => {
    const inputsToDisable = [];
    if (temperature.value && pressure.value) {
      inputsToDisable.push(specificVolume, specificEnthalpy, specificEntropy, quality);
    } else if (temperature.value && specificVolume.value) {
      inputsToDisable.push(pressure, specificEnthalpy, specificEntropy, quality);
    } else if (temperature.value && specificEnthalpy.value) {
      inputsToDisable.push(pressure, specificVolume, specificEntropy, quality);
    } else if (temperature.value && specificEntropy.value) {
      inputsToDisable.push(pressure, specificVolume, specificEnthalpy, quality);
    } else if (temperature.value && quality.value) {
      inputsToDisable.push(pressure, specificVolume, specificEnthalpy, specificEntropy);
    } else {
      allInputs.forEach((input) => toggleInputDisable(input, false));
    }
    inputsToDisable.forEach((input) => toggleInputDisable(input));
  });

  pressure.addEventListener("input", () => {
    const inputsToDisable = [];
    if (pressure.value && temperature.value) {
      inputsToDisable.push(specificVolume, specificEnthalpy, specificEntropy, quality);
    } else if (pressure.value && specificVolume.value) {
      inputsToDisable.push(temperature, specificEnthalpy, specificEntropy, quality);
    } else if (pressure.value && specificEnthalpy.value) {
      inputsToDisable.push(temperature, specificVolume, specificEntropy, quality);
    } else if (pressure.value && specificEntropy.value) {
      inputsToDisable.push(temperature, specificVolume, specificEnthalpy, quality);
    } else if (pressure.value && quality.value) {
      inputsToDisable.push(temperature, specificVolume, specificEnthalpy, specificEntropy);
    } else {
      allInputs.forEach((input) => toggleInputDisable(input, false));
    }
    inputsToDisable.forEach((input) => toggleInputDisable(input));
  });

  specificVolume.addEventListener("input", () => {
    const inputsToDisable = [];
    if (specificVolume.value && temperature.value) {
      inputsToDisable.push(pressure, specificEnthalpy, specificEntropy, quality);
    } else if (specificVolume.value && pressure.value) {
      inputsToDisable.push(temperature, specificEnthalpy, specificEntropy, quality);
    } else if (specificVolume.value) {
      inputsToDisable.push(specificEnthalpy, specificEntropy, quality);
    } else {
      allInputs.forEach((input) => toggleInputDisable(input, false));
    }
    inputsToDisable.forEach((input) => toggleInputDisable(input));
  });

  specificEnthalpy.addEventListener("input", () => {
    const inputsToDisable = [];
    if (specificEnthalpy.value && temperature.value) {
      inputsToDisable.push(pressure, specificVolume, specificEntropy, quality);
    } else if (specificEnthalpy.value && pressure.value) {
      inputsToDisable.push(temperature, specificVolume, specificEntropy, quality);
    } else if (specificEnthalpy.value) {
      inputsToDisable.push(specificVolume, specificEntropy, quality);
    } else {
      allInputs.forEach((input) => toggleInputDisable(input, false));
    }
    inputsToDisable.forEach((input) => toggleInputDisable(input));
  });

  specificEntropy.addEventListener("input", () => {
    const inputsToDisable = [];
    if (specificEntropy.value && temperature.value) {
      inputsToDisable.push(pressure, specificVolume, specificEnthalpy, quality);
    } else if (specificEntropy.value && pressure.value) {
      inputsToDisable.push(temperature, specificVolume, specificEnthalpy, quality);
    } else if (specificEntropy.value) {
      inputsToDisable.push(specificVolume, specificEnthalpy, quality);
    } else {
      allInputs.forEach((input) => toggleInputDisable(input, false));
    }
    inputsToDisable.forEach((input) => toggleInputDisable(input));
  });

  quality.addEventListener("input", () => {
    const inputsToDisable = [];
    if (quality.value && temperature.value) {
      inputsToDisable.push(pressure, specificVolume, specificEnthalpy, specificEntropy);
    } else if (quality.value && pressure.value) {
      inputsToDisable.push(temperature, specificVolume, specificEnthalpy, specificEntropy);
    } else if (quality.value) {
      inputsToDisable.push(specificVolume, specificEnthalpy, specificEntropy);
    } else {
      allInputs.forEach((input) => toggleInputDisable(input, false));
    }
    inputsToDisable.forEach((input) => toggleInputDisable(input));
  });
}
