import UI from "./view/index.js";
import controller from "./controller/index.js";
UI.start();

const result = {
  substance: 1,
  temperature: 102,
  pressure: null,
  specificVolume: null,
  internalEnergy: null,
  specificEnthalpy: null,
  specificEntropy: null,
  quality: 0,
};

controller(result);
