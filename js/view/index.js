import showCorrectTemperature from "./showCorrectTemperature.js";
import toggleCalculations from "./toggleCalculations.js";
const UI = {
  start() {
    showCorrectTemperature();
    toggleCalculations();
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
