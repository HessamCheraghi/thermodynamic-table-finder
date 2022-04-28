import showCorrectTemperature from "./showCorrectTemperature.js";
const UI = {
  start() {
    showCorrectTemperature();
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
