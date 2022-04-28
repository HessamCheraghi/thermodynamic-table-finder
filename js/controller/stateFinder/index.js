import smartSearch from "../smartSearch/index.js";
import onPressureTemperature from "./onPressureTemperature.js";
import onTemperature from "./onTemperature.js";
import onPressure from "./onPressure.js";

//test data
const x = {
  substance: 2,
  temperature: 17,
  pressure: 900,
  specificVolume: null,
  specificEnthalpy: null,
  specificEntropy: null,
  quality: null,
};
export default function (tables, inputValues = x) {
  let substance;
  if (inputValues.temperature && inputValues.pressure) {
    substance = onPressureTemperature(tables, inputValues);
  } else if (inputValues.temperature) {
    substance = onTemperature(tables, inputValues);
  } else if (inputValues.pressure) {
    substance = onPressure(tables, inputValues);
  } else {
    console.error("there is a problem in substance finder !");
  }
  console.log(substance);
}
