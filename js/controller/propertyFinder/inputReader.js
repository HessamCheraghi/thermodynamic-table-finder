export default function (inputValues) {
  const output = [];
  if (inputValues.temperature) {
    output.push("temp.");
    output.push(inputValues.temperature);
  }
  if (inputValues.pressure) {
    output.push("press.");
    output.push(inputValues.pressure);
  }
  if (inputValues.specificVolume) {
    output.push("v");
    output.push(inputValues.specificVolume);
  }
  if (inputValues.internalEnergy) {
    output.push("u");
    output.push(inputValues.internalEnergy);
  }
  if (inputValues.specificEnthalpy) {
    output.push("h");
    output.push(inputValues.specificEnthalpy);
  }
  if (inputValues.specificEntropy) {
    output.push("s");
    output.push(inputValues.specificEntropy);
  }
  return output;
}
