export default function () {
  const checkbox = document.querySelector("#show-calculations");
  const calculationElement = document.querySelector("#calculations");
  const resultElement = document.querySelector("#result");
  checkbox.addEventListener("input", () => {
    if (!checkbox.checked) {
      calculationElement.style.display = "none";
      calculationElement.style.visibility = "hidden";
      resultElement.setAttribute("style", "margin-bottom:0px !important");
    } else {
      calculationElement.removeAttribute("style");
      resultElement.removeAttribute("style");
    }
  });
}
