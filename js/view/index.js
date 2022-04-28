const UI = {
  start() {},
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
