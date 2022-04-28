import showCorrectTemperature from "./showCorrectTemperature.js";
import toggleCalculations from "./toggleCalculations.js";
import inputBlocker from "./inputBlocker.js";
const UI = {
  start() {
    showCorrectTemperature();
    toggleCalculations();
    inputBlocker();
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
