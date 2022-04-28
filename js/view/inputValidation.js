export default function () {
  const allInputs = document.querySelectorAll("input[type='number']");

  const validator = function (input) {
    input.addEventListener("invalid", (e) => {
      e.preventDefault();
      const message = input.parentNode.querySelector(".help");
      if (!message) {
        const errorMassage = document.createElement("p");
        errorMassage.classList.add("help", "is-danger");
        errorMassage.textContent = input.validationMessage;
        input.after(errorMassage);
        input.classList.add("is-danger");
      }
    });
    input.addEventListener("change", () => {
      allInputs.forEach((input) => {
        const message = input.parentNode.querySelector(".help");
        if (message) {
          message.remove();
          input.classList.remove("is-danger");
        }
      });
    });
  };

  allInputs.forEach((input) => {
    validator(input);
  });
}
