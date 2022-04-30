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

    //testing
    controller();
    // this.control();
    //end of testing

    document.querySelector("#clear-input").addEventListener("click", () => this.clear(true));
  },
  control() {
    const form = document.querySelector("form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.clear();
      controller(requestInputValues());
    });
  },
  log(message = "\n") {
    console.log(message);
  },
  clear(everything = false) {
    if (everything) console.log("clear everything");
    else console.clear();
  },
};
export default UI;
