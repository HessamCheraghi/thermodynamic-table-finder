import UI from "./view/index.js";
import controller from "./controller/index.js";
UI.start();

const result = {
  substance: 1,
  temperature: 175,
  pressure: 75,
  specificVolume: null,
  internalEnergy: null,
  specificEnthalpy: null,
  specificEntropy: null,
  quality: null,
};

controller(result);
