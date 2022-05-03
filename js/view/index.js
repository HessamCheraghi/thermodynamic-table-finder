import showCorrectTemperature from "./showCorrectTemperature.js";
import toggleCalculations from "./toggleCalculations.js";
import inputBlocker from "./inputBlocker.js";
import inputValidation from "./inputValidation.js";
import requestInputValues from "./requestInputValues.js";
import controller from "../controller/index.js";
import updateUI from "./updateUI.js";
const UI = {
  start() {
    showCorrectTemperature();
    toggleCalculations();
    inputBlocker();
    inputValidation();
    this.control();
    document.querySelector("#clear-input").addEventListener("click", () => this.clear());
    document.querySelector("#substance").addEventListener("change", () => this.clear());
  },
  control() {
    const form = document.querySelector("form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      controller(requestInputValues());
    });
  },
  log(message = "-------------------------") {
    // logs messages to the UI and console
    document.querySelector("pre").insertAdjacentText("beforeend", "\n" + message);
    console.log(message);
  },
  clear() {
    // only clears UI doesn't clears console
    document.querySelector("pre").textContent = "#hello world";
    document.querySelectorAll("input[type='number']").forEach((input) => {
      input.value = "";
      input.disabled = false;
      input.required = true;
    });
  },
  update(outputValues) {
    updateUI(outputValues);
  },
};
export default UI;
