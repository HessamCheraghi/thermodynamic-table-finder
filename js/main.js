import UI from "./view/index.js";
import controller from "./controller/index.js";
UI.start();

const result = {
  substance: 1,
  temperature: 102,
  pressure: null,
  specificVolume: null,
  internalEnergy: 2000,
  specificEnthalpy: null,
  specificEntropy: null,
  quality: null,
};

controller(result);
