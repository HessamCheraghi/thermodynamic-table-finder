import showCorrectTemperature from "./showCorrectTemperature.js";
import toggleCalculations from "./toggleCalculations.js";
import inputBlocker from "./inputBlocker.js";
import inputValidation from "./inputValidation.js";
const UI = {
  start() {
    showCorrectTemperature();
    toggleCalculations();
    inputBlocker();
    inputValidation();
  },
  control() {
    const form = document.querySelector("form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
    });
  },
  clear() {},
  update() {},

  easterEgg() {},
};
export default UI;
