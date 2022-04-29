import showCorrectTemperature from "./showCorrectTemperature.js";
import toggleCalculations from "./toggleCalculations.js";
import inputBlocker from "./inputBlocker.js";
import inputValidation from "./inputValidation.js";
import requestInputValues from "./requestInputValues.js";
import controller from "../controller/index.js";
const UI = {
  start() {
    showCorrectTemperature();
    toggleCalculations();
    inputBlocker();
    inputValidation();

    this.control();
  },
  control() {
    const form = document.querySelector("form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      console.clear();
      controller(this.inputValues());
    });
  },
  log(message) {},
  clear() {},
  update() {},

  easterEgg() {},
  inputValues() {
    return requestInputValues();
  },
};
export default UI;
