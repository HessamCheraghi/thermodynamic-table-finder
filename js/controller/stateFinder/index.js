import smartSearch from "../smartSearch/index.js";
import onPressureTemperature from "./onPressureTemperature.js";
import onTemperature from "./onTemperature.js";
import onPressure from "./onPressure.js";

//test data
const x = {
  substance: 3,
  temperature: null,
  pressure: 800,
  specificVolume: null,
  internalEnergy: null,
  specificEnthalpy: null,
  specificEntropy: null,
  quality: 0,
};
export default function (tables, inputValues = x) {
  let substance;
  if (inputValues.temperature && inputValues.pressure) {
    // send data to pressure temperature function
    substance = onPressureTemperature(tables, inputValues);
  } else if (inputValues.quality !== null) {
    // send you already know the substance
    console.log("quality value was detected");
    if (inputValues.quality === 0) {
      substance = "sat.liquid";
      console.log("state of the substance is sup.vapor :=> quality = 0");
    } else {
      substance = "sat.vapor";
      console.log("state of the substance is sup.vapor :=> 0 < quality ≤ 1 ");
    }
  } else if (inputValues.temperature) {
    // send data to temperature only function
    substance = onTemperature(tables, inputValues);
  } else if (inputValues.pressure) {
    // send data to pressure only function
    substance = onPressure(tables, inputValues);
  } else {
    console.error("there is a problem in substance finder !");
  }
  console.log(substance);
}
